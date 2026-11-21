# Nebula reader and translated sky names

The observatory's existing night-sky reader now includes a separate collection
of 12 genuine nebulae. Its Persian, English and German titles, object types and
short original scientific descriptions are in `src/night-nebulae-data.js`.
`src/night-nebulae.js` renders the 12-option selector, previous/next controls,
three-language name line, selected-language explanation and official NASA link.
Persian names appear in the selector and heading when the city language is FA;
the collection uses RTL without reversing the existing English chart prose.

| Object | Identifier | Type |
| --- | --- | --- |
| Orion | M42 / NGC 1976 | Star-forming region |
| Lagoon | M8 / NGC 6523 | Star-forming region |
| Eagle | M16 / IC 4703 | Star-forming region |
| Carina | NGC 3372 / Caldwell 92 | Star-forming region |
| Tarantula |30 Doradus | Star-forming region in the Large Magellanic Cloud |
| Horsehead | Barnard 33 | Dark gas-and-dust cloud |
| Crab | M1 / NGC 1952 | Supernova remnant |
| Ring | M57 / NGC 6720 | Planetary nebula |
| Helix | NGC 7293 | Planetary nebula |
| Cat's Eye | NGC 6543 | Planetary nebula |
| Butterfly | NGC 6302 / Caldwell 69 | Planetary nebula |
| Veil | Cygnus Loop / NGC 6960,6992 | Supernova remnant |

The guide explains that nebulae are real clouds/remnants rather than the
line-of-sight patterns called constellations; planetary nebulae are not planets.
Telescope source photographs can use assigned colours and reveal more than the
naked eye. This addition supplies official viewing links, not embedded pictures
or new image files. It does not invent nebula directions, add decorative fog,
reposition catalogue stars or claim telescope pictures are naked-eye sky views.

The six existing constellation titles now have Persian/German display forms:
Orion, Cassiopeia, Ursa Major, Cygnus, Leo and Scorpius. The original English
guide records, IDs, HIP identifiers, edges, dated charts, tour math and measured
sky buffers remain unchanged. `night-sky.js` refreshes names on`city-language`
and disposes that listener with the reader. Language switching preserves both
the selected nebula and the constellation/chart. No visitor storage or voices
are accessed or altered.

## Sources and checks

Every object links to its NASA primary source in the data. All 12 source pages
returned 200 on 21 November 2026; `assets/night-nebulae/source-audit.json` retains
the source metadata check. This metadata audit is not a claim of image decoding
or an image-reproduction licence. Translations and explanations are original
short educational copy, not quotations or certified NASA translations.

Focused checks:

```text
node tests/night-nebulae.mjs
node tests/night-sky-ui.mjs
node tests/night-sky.mjs
node tests/night-sky-tour.mjs
```

They cover all 12 actual selections and source links, three-language text,
Persian names/RTL, selection preservation and disposal, plus the existing real
star geometry, horizon rules, physical telescope gates, no-private-data contract
and unchanged constellation tour. Browser review remains a separate release step.
