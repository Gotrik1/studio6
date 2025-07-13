# dev.nix / workspace.nix
# Подробнее о настройке среды через Nix:
# https://firebase.google.com/docs/studio/customize-workspace
{ pkgs }: {
  # Канал nixpkgs (stable‑24.11 = ближайший LTS‑снапшот).
  channel = "stable-24.11";   # или "unstable"

  # Пакеты, которые будут установлены постоянно в окружении
  packages = [
    pkgs.nodejs_20   # Node 20 LTS
    pkgs.pnpm        # пакетный менеджер pnpm
    pkgs.zulu        # JDK (Zulu) — нужен Firebase Emulators
  ];

  # Переменные окружения
  env = { };

  # Автозапуск Firebase Emulators, когда в рабочем каталоге появляется firebase.json
  services.firebase.emulators = {
    detect    = true;
    projectId = "demo-app";
    services  = [ "auth" "firestore" ];
  };

  idx = {
    # Расширения VS Code, которые будут предустановлены
    extensions = [
      # "vscodevim.vim"
    ];

    workspace = {
      onCreate = {
        default.openFiles = [
          "frontend/src/app/page.tsx"
        ];
      };
    };

    # Настройки превью‑серверов в Cloud IDE
    previews = {
      enable   = true;
      previews = {
        web = {
          command  = [ "npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0" ];
          manager  = "web";
        };
      };
    };
  };
}
