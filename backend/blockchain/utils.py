import hashlib


class BlockchainUtils:

    @staticmethod
    def sha256(data):

        return hashlib.sha256(
            data.encode()
        ).hexdigest()