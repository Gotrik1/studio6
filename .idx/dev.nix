{ pkgs, ... }:
{
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_20
    pkgs.pnpm
    pkgs.zulu       # Java — только если требуется
    pkgs.docker     # ⚙️ Docker CLI
    pkgs.openssl    # 🟢 Добавил OpenSSL — для Prisma!
  ];

  env = { };

  services = {
    docker.enable = true;   # включаем демон Docker
    firebase.emulators = {
      detect = true;
      projectId = "demo-app";
      services = [ "auth" "firestore" ];
    };
    # (Postgres убрал, чтобы не было ошибок)
  };

  idx = {
    extensions = [ ];
    workspace.onCreate = {
      default.openFiles = [ "frontend/src/app/page.tsx" ];
    };
    previews.enable = true;
    previews.previews = {
      web = {
        command = [
          "npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}
