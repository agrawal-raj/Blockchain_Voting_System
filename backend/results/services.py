from django.db.models import Count

from voting.models import Vote
from positions.models import Position
from candidates.models import Candidate
from elections.models import Election
from organizations.models import Organization
from blockchain.models import BlockchainBlock
from blockchain.validators import BlockchainValidator

class ResultService:

    @staticmethod
    def position_result(position_id):

        position = Position.objects.get(id=position_id)

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
            "position": position.title,
            "total_votes": total_votes,
            "winner": candidates[0] if candidates else None,
            "candidates": candidates,
        }
    
    @staticmethod
    def election_result(election_id):

        election = Election.objects.get(
            id=election_id
        )

        positions = Position.objects.filter(
            election=election
        ).order_by("display_order")

        results = []

        for position in positions:

            result = ResultService.position_result(
                position.id
            )

            results.append(result)

        return {

            "organization": (
                election.organization.name
                if election.organization
                else None
            ),

            "election": election.title,

            "status": election.status,

            "positions": results,

            "blockchain_verified":
                BlockchainValidator.verify(),
        }
    
    @staticmethod
    def organization_result(organization_id):

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
                    election.id
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
        from candidates.models import Candidate

        return {

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
        }