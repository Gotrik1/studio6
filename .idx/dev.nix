{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_20   # Node.js 20
    pkgs.pnpm        # PNPM — официальный, не через кастомную сборку!
    pkgs.zulu        # Java (если нужен для Firebase, иначе убери строку)
  ];

  env = { };

  services = {
    firebase.emulators = {
      detect = true;
      projectId = "demo-app";
      services = [ "auth" "firestore" ];
    };
  };

  idx = {
    extensions = [
      # "vscodevim.vim" # раскомментируй если нужен vim-плагин в IDE
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "frontend/src/app/page.tsx"
        ];
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}
