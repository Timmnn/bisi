from lib.bash import BashCommand


def backup_folder(path: str, backup_key: str):
    BashCommand(
        f"rclone sync {path} onedrive_bisi:BisiBackups/{backup_key}/{path[1:]} --progress --exclude 'node_modules/**' --exclude 'dist/**' --exclude '.venv/**' --exclude '.sst/**' --exclude 'target/**' --exclude '.git/**' --transfers 50"
    ).run()


#        ~/bisi  restic -r rclone:onedrive_bisi:BisiBackup backup ~/Dev/  --exclude 'node_modules/**' --exclude 'dist/**' --exclude '.venv/**' --exclude '.sst/**' --exclude 'target/**'
