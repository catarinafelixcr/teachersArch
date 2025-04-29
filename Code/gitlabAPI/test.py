from gitlab import Gitlab
import os

gitlab_url = "https://gitlab.com"
gitlab_token = os.getenv("GITLAB_TOKEN", "glpat-z7gzPpe48a5krLoLa4o4")
gl = Gitlab(gitlab_url, private_token=gitlab_token)

try:
    project = gl.projects.get("dei-uc/es2023/pl1")
    members = project.list(all=True)
    if members:
        for m in members:
            print(m["username"])
    else:
        print("No direct members found. Checking group...")
        group = gl.groups.get("dei-uc/es2023")
        group_members = group.members.list(all=True)
        for m in group_members:
            print(f"@{m.username}")
except Exception as e:
    print("Error:", e)
