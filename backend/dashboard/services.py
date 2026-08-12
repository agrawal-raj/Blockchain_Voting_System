from organizations.models import Organization
from elections.models import Election
from positions.models import Position
from candidates.models import Candidate
from voting.models import Vote
from accounts.models import User



class DashboardService:

    @staticmethod
    def dashboard():

        total_orgs = Organization.objects.count()

        total_elections = Election.objects.count()

        active_elections = Election.objects.filter(
            status="ACTIVE"
        ).count()

        completed_elections = Election.objects.filter(
            status="COMPLETED"
        ).count()

        draft_elections = Election.objects.filter(
            status="DRAFT"
        ).count()

        total_positions = Position.objects.count()

        total_candidates = Candidate.objects.count()

        total_voters = User.objects.filter(
            role="VOTER"
        ).count()

        total_votes = Vote.objects.count()

        voting_percentage = 0

        if total_voters:

            voting_percentage = round(
                (total_votes / total_voters) * 100,
                2,
            )

        return {

            "organizations": total_orgs,

            "total_elections": total_elections,

            "active_elections": active_elections,

            "completed_elections": completed_elections,

            "upcoming_elections": draft_elections,

            "positions": total_positions,

            "candidates": total_candidates,

            "voters": total_voters,

            "votes": total_votes,

            "voting_percentage": voting_percentage,

        }