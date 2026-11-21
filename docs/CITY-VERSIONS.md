# City versions

Version 1 is preserved in the published Git tag `city-v1-before-mountain-removal` (commit `0f3dfe5`). Restore it in a separate branch with `git switch -c restore-city-v1 city-v1-before-mountain-removal`.

Version 2 is the current main city. `CITY_CONFIG.edition=2` and `mountainEnabled=false` remove the mountain assembly, chapter picks, lift and summit bridge from the live scene, release its ground collision, disable climbing capture and hide mountain start options. The gallery roof has an ordinary complete perimeter guard and remains reachable by its own stairs. Original mountain source and chapter content remain in the repository.

The user's21 November request sets `superhumanEnabled=false`: the golden
emerging figure, its light, particles, artwork picks and summit-story UI/entry
are disabled. Sculpture geometry, story code and original text remain available;
setting the flag true restores the preserved scene. Ordinary volcano rock,
lava, roof walks and Babel connections remain. The molten channels now use an
original moving orange-red/crusted texture shared by base and emission, with
restrained intensity. `daySun` places the upper city's directional sun at
(0,120,0), aimed at the city centre. The lower night frame remains unchanged.
