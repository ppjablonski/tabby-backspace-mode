"""Build a dependency-free ZIP that unpacks into <plugins dir>/node_modules/<plugin>."""
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
metadata = json.loads((root / 'package.json').read_text())
name = metadata['name']
version = metadata['version']
prefix = f'node_modules/{name}'
files = ['package.json', 'dist/index.js', 'README.md', 'LICENSE']
# Build tooling has no role in the installed package.
runtime_metadata = {key: metadata[key] for key in
                    ['name', 'version', 'description', 'license', 'author', 'keywords', 'main']}
release = root / 'release'
release.mkdir(exist_ok=True)
archive = release / f'{name}-{version}-windows.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as package:
    for filename in files:
        data = ((json.dumps(runtime_metadata, indent=2) + '\n').encode()
                if filename == 'package.json' else (root / filename).read_bytes())
        info = zipfile.ZipInfo(f'{prefix}/{filename}', date_time=(2026, 1, 1, 0, 0, 0))
        info.external_attr = 0o100644 << 16
        info.compress_type = zipfile.ZIP_DEFLATED
        package.writestr(info, data)
with zipfile.ZipFile(archive) as package:
    assert set(package.namelist()) == {f'{prefix}/{f}' for f in files}
print(archive)
