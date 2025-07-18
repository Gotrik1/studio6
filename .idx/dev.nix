{ pkgs, ... }:

let
  # Заменяем стандартный pnpm на нужную версию через overrideAttrs
  pnpm_10 = pkgs.nodePackages.pnpm.overrideAttrs (old: {
    version = "10.13.1";
    src = pkgs.fetchurl {
      url = "https://registry.npmjs.org/pnpm/-/pnpm-10.13.1.tgz";
      sha256 = "sha256-D57UjYCJlq4AeDX7XEZBz5owDe8u3cnpV9m75HaMXyg=";
    };
  });
in
{
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_20
    pnpm_10
    pkgs.zulu
    pkgs.docker
    pkgs.openssl
  ];

  env = { };

  services = {
    docker.enable = true;
    firebase.emulators = {
      detect = true;
      projectId = "demo-app";
      services = [ "auth" "firestore" ];
    };
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
