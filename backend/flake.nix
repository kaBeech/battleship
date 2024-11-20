{
  description = "Battleship backend development shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in
  {
    devShells.${system}.default = 
      pkgs.mkShell 
        {
          buildInputs = with pkgs; [
            python3
            python312Packages.flask
            python312Packages.flask-cors
            python312Packages.pytest_7
          ];
        };
  };
}
