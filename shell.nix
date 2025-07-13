with import <nixpkgs> {};

let
  myPnpm = pkgs.stdenv.mkDerivation {
    pname = "pnpm";
    version = "10.13.1";

    src = pkgs.fetchurl {
      url = "https://registry.npmjs.org/pnpm/-/pnpm-10.13.1.tgz";
      sha256 = "sha256-D57UjYCJlq4AeDX7XEZBz5owDe8u3cnpV9m75HaMXyg=";
    };

    nativeBuildInputs = [ pkgs.nodejs_20 pkgs.nodePackages.npm ];

    unpackPhase = "true";

    installPhase = ''
      export HOME=$TMPDIR
      export npm_config_cache=$TMPDIR/.npm

      mkdir -p $out/bin

      # Устанавливаем pnpm в локальную директорию
      npm install --prefix=$TMPDIR pnpm@10.13.1

      # Копируем исполняемый файл
      cp $TMPDIR/bin/pnpm $out/bin/
    '';
  };
in

mkShell {
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    myPnpm
  ];

  shellHook = ''
    echo "🟢 pnpm $(pnpm -v) и node $(node -v) готовы к работе"
  '';
}
