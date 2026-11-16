# City versions

Version 1 is preserved in the published Git tag `city-v1-before-mountain-removal` (commit `0f3dfe5`). Restore it in a separate branch with `git switch -c restore-city-v1 city-v1-before-mountain-removal`.

Version 2 is the current main city. `CITY_CONFIG.edition=2` and `mountainEnabled=false` remove the mountain assembly, chapter picks, lift and summit bridge from the live scene, release its ground collision, disable climbing capture and hide mountain start options. The gallery roof has an ordinary complete perimeter guard and remains reachable by its own stairs. Original mountain source and chapter content remain in the repository.
