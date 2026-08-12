from django.db.models import Count

from audit.models import AuditLog
from audit.services import AuditService
from voting.models import Vote
from positions.models import Position
from candidates.models import Candidate
from elections.models import Election
from organizations.models import Organization
from blockchain.models import BlockchainBlock
from blockchain.validators import BlockchainValidator
from rest_framework.exceptions import PermissionDenied


class ResultService:

    @staticmethod
    def ensure_results_access(user, election):
        """
        Admin users can always view results.
        Other users can only view published results.
        """

        if user and (
            user.is_superuser
            or user.is_staff
            or getattr(user, "role", None) == "ADMIN"
        ):
            return

        if not election.is_result_published:
            raise PermissionDenied(
                "Results have not been published yet."
            )


    @staticmethod
    def position_result(position_id, user=None):

        position = Position.objects.get(id=position_id)

        ResultService.ensure_results_access(
            user,
            position.election,
        )
        AuditService.log(
            user=user,
            action=AuditLog.Action.VIEW,
            module="Results",
            description=(
                f"Viewed results for position "
                f"'{position.title}'."
            ),
            object_id=str(position.id),
        )
        candidates = []

        total_votes = Vote.objects.filter(
            candidate__position=position
        ).count()

        for candidate in Candidate.objects.filter(
            position=position
        ):

            votes = Vote.objects.filter(
                candidate=candidate
            ).count()

            percentage = 0

            if total_votes:
                percentage = round(
                    (votes / total_votes) * 100,
                    2,
                )

            candidates.append(
                {
                    "id": str(candidate.id),
                    "candidate": f"{candidate.first_name} {candidate.last_name}",
                    "votes": votes,
                    "percentage": percentage,
                }
            )

        candidates.sort(
            key=lambda x: x["votes"],
            reverse=True,
        )

        return {
            "position_id": str(position.id),
            "position": position.title,
            "total_votes": total_votes,
            "winner": candidates[0] if candidates else None,
            "candidates": candidates,
        }
    
    @staticmethod
    def election_result(election_id, user=None):

        election = Election.objects.get(
            id=election_id
        )
        ResultService.ensure_results_access(
            user,
            election,
        )
        AuditService.log(
            user=user,
            action=AuditLog.Action.VIEW,
            module="Results",
            description=(
                f"Viewed results for election "
                f"'{election.title}'."
            ),
            object_id=str(election.id),
        )

        positions = Position.objects.filter(
            election=election
        ).order_by("display_order")

        results = []

        for position in positions:

            result = ResultService.position_result(
                position.id,
                user=user
            )

            results.append(result)

        return {

            "organization": (
                election.organization.name
                if election.organization
                else None
            ),

            "election_id": str(election.id),
            
            "election": election.title,

            "status": election.status,

            "is_result_published": election.is_result_published,

            "result_published_at": election.result_published_at,

            "positions": results,

            "blockchain_verified":
                BlockchainValidator.verify(),
                
        }
    
    @staticmethod
    def organization_result(organization_id, user=None):

        organization = Organization.objects.get(
            id=organization_id
        )

        elections = Election.objects.filter(
            organization=organization
        )

        results = []

        for election in elections:

            results.append(

                ResultService.election_result(
                    election.id,
                    user=user
                ),
                AuditService.log(
                    user=user,
                    action=AuditLog.Action.VIEW,
                    module="Results",
                    description=(
                        f"Viewed organization results "
                        f"for '{organization.name}'."
                    ),
                    object_id=str(organization.id),
                    )
                
            )

        return {

            "organization": organization.name,

            "total_elections": elections.count(),

            "results": results,
        }
    
    @staticmethod
    def dashboard():

        from accounts.models import User

        statistics = {

            "organizations":
                Organization.objects.count(),

            "elections":
                Election.objects.count(),

            "active_elections":
                Election.objects.filter(
                    status="ACTIVE"
                ).count(),

            "completed_elections":
                Election.objects.filter(
                    status="COMPLETED"
                ).count(),

            "positions":
                Position.objects.count(),

            "candidates":
                Candidate.objects.count(),

            "registered_users":
                User.objects.count(),

            "votes":
                Vote.objects.count(),

            "blockchain_blocks":
                BlockchainBlock.objects.count(),

            "blockchain_verified":
                BlockchainValidator.verify(),

            "published_results" : Election.objects.filter(
                is_result_published=True
            ).count(),

            "pending_results" : Election.objects.filter(
                status=Election.Status.COMPLETED,
                is_result_published=False
            ).count()
            ,
            "verified_results" : Election.objects.filter(
                is_result_published=True
            ).count(),

        }

        elections = []

        for election in Election.objects.select_related(
            "organization"
        ):

            elections.append({

                "id": str(election.id),

                "title": election.title,

                "organization": (
                    election.organization.name
                    if election.organization
                    else "-"
                ),

                "status": election.status,

                "positions": Position.objects.filter(
                    election=election
                ).count(),

                "votes": Vote.objects.filter(
                    candidate__position__election=election
                ).count(),

            })

        return {

            "statistics": statistics,

            "elections": elections,

        }

    @staticmethod
    def ensure_results_access(user, election):
        """
        Admin users can always view results.
        Other users can only view published results.
        """

        if user and (
            user.is_superuser
            or user.is_staff
            or getattr(user, "role", None) == "ADMIN"
        ):
            return

        if not election.is_result_published:
            raise PermissionDenied(
                "Results have not been published yet."
            )

        
    @staticmethod
    def get_election_results(
    election_id,
    user=None,
    ):
        ResultService.ensure_results_access(
    user,
    election_id,
    )   


    @staticmethod
    def published_results(user=None):

        elections = (
            Election.objects
            .filter(
                status=Election.Status.COMPLETED,
                is_result_published=True,
            )
            .select_related("organization")
            .order_by("-result_published_at")
        )

        results = []

        for election in elections:

            results.append({

                "id": str(election.id),

                "title": election.title,

                "organization": (
                    election.organization.name
                    if election.organization
                    else "-"
                ),

                "published_at": election.result_published_at,

                "positions": Position.objects.filter(
                    election=election
                ).count(),

                "votes": Vote.objects.filter(
                    candidate__position__election=election
                ).count(),

                "blockchain_verified": BlockchainValidator.verify(),

            })

        return {

            "total_results": len(results),

            "results": results,

        }