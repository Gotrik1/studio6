with import <nixpkgs> {};

mkShell {
  packages = [
    nodejs_20
    nodePackages.npm
  ];

  shellHook = ''
    export HOME=$TMPDIR
    export npm_config_cache=$TMPDIR/.npm

    if ! command -v pnpm >/dev/null || [[ "$(pnpm -v)" != "10.13.1" ]]; then
      echo "📦 Устанавливаю pnpm@10.13.1 локально..."
      npm install -g pnpm@10.13.1 --prefix "$TMPDIR/pnpm"
    fi

    export PATH="$TMPDIR/pnpm/bin:$PATH"

    echo "🟢 pnpm $(pnpm -v) и node $(node -v) готовы к работе"
    echo "📍 which pnpm: $(which pnpm)"
  '';
}
