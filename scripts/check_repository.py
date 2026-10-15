"""Validate repository scaffolding and relative Markdown links, not app behavior."""

from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "README.md",
    ".env.example",
    "compose.yaml",
    ".github/workflows/repository-checks.yml",
    "apps/web/README.md",
    "apps/backend/README.md",
    "apps/backend/cmd/api",
    "apps/backend/cmd/worker",
    "contracts/README.md",
    "db/migrations",
    "db/seeds",
    "docs/FLUJO_GIT.md",
    "entregas/01-LUNES.md",
    "infra/README.md",
    "tests/e2e/README.md",
)
MODULES = (
    "auth", "company", "catalog", "campaign", "generation", "content",
    "analytics", "platform",
)
EXCLUDED = {".git", "node_modules", "dist", "build", ".venv", "__pycache__"}


def main() -> int:
    errors = []
    for entry in REQUIRED:
        if not (ROOT / entry).exists():
            errors.append(f"Missing required path: {entry}")
    for module in MODULES:
        if not (ROOT / "apps/backend/internal" / module).is_dir():
            errors.append(f"Missing backend module: {module}")

    files = [
        path for path in ROOT.rglob("*.md")
        if not any(part in EXCLUDED for part in path.relative_to(ROOT).parts)
    ]
    for path in files:
        text = path.read_text(encoding="utf-8")
        if text.count("```") % 2:
            errors.append(f"Unclosed code fence: {path.relative_to(ROOT)}")
        # This deliberately checks simple inline links in the current documents.
        prose = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
        for target in re.findall(r"\]\(([^)]+)\)", prose):
            target = target.strip().strip("<>")
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            destination = path.parent / unquote(parsed.path)
            if not destination.exists():
                errors.append(f"Broken link in {path.relative_to(ROOT)}: {target}")

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print(f"OK: structure and local links in {len(files)} Markdown files")
    print("Application build, tests and functionality are not checked here.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
