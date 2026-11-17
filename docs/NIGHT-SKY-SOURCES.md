# Observatory star chart: sources and interpretation

This is a dated educational Earth-sky chart in the lower face's existing local
frame. It is not a live view or a simulation of the fictional world's orbit.
The default chart is **2026-11-17, 21:00 UTC, Prague, 50.1° N, 14.42° E**.
Choosing a seasonal chart changes these sky coordinates; the city stays at night.

## Catalogue attribution and license

`src/night-sky-catalogue.json` is adapted from **HYG v4.1**, compiled by
**David Nash / Astronexus**, from the Hipparcos, Yale Bright Star and Gliese
catalogues. The star-data adaptation is distributed under the same
[Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/).
Keep that attribution, license link, original source link and modification notice
with the JSON and in the visitor-facing source information. No endorsement is
implied. The original license is preserved by the
[frozen upstream license file](https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT/LICENSE).

The deliberately frozen source is
[hygdata_v41.csv at commit c7f7f883fe678cc7680169a50ccd7dcc49b060ce](https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT/hygdata_v41.csv).
Its SHA-256 is
`d9f69fd86bbf90a4e4d52b4c5c53eacfa6dfc0bfdef85bfd94f095e0bebe4ebd`.
The archived GitHub snapshot is reproducible; it is not claimed to be the latest
HYG release. [The author's current project](https://www.astronexus.com/projects/hyg)
and [Codeberg repository](https://codeberg.org/astronexus/hyg) hold later versions.

Adaptation recipe: parse the quoted CSV; retain rows with a nonempty `hip` and
numeric visual `mag <= 5.5`; omit the Sun; sort numerically by HIP. Rename `ra`
to `raHours`, `dec` to `decDeg`, `mag` to `magnitude`, and `ci` to `colorIndex`;
keep `proper` as optional `name`. Numeric coordinate precision is retained;
missing colour indices become null. This yields **2,848 stars, 259,458 bytes**
including metadata. It does not synthesize extra stars or infer missing values.
The [upstream field documentation](https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/README.md)
specifies J2000 coordinates and B−V colour indices. Some companion names are
HYG editorial names, so the chart does not describe every label as IAU-approved.

## Astronomy and numerical checks

`night-sky-model.js` implements an original compact coordinate calculation:
Unix UTC to Julian date; mean local sidereal time; J2000 precession; horizon
coordinates. Azimuth is clockwise from north. Local axes are east +X, up +Y,
south +Z. The existing proper half-turn places this sky on the lower physical
face; individual star coordinates must not receive a second reflection.

The sidereal expression follows the
[U.S. Naval Observatory's approximate algorithm](https://aa.usno.navy.mil/faq/GAST).
An independent request to its
[public sidereal-time service](https://aa.usno.navy.mil/api/siderealtime?date=2026-11-17&time=21:00:00&coords=50.1%2C14.42&reps=1&intv_mag=1&intv_unit=hours)
returned mean local sidereal time **01:45:24.1062** for the default chart.
The implementation agrees to better than 0.000002 degrees.

Precession uses the standard IAU 1976 angle polynomials recorded in IERS
Technical Note 32, chapter 5, equation 31, independently checked against the
published `eraPmat76` matrix fixture in the
[ERFA test suite](https://github.com/liberfa/erfa/blob/master/src/t_erfa_c.c).
The horizon conversion also matches its `eraHd2ae` numerical fixture. The test
suite additionally checks east/west signs, the north celestial pole's altitude,
J2000, every catalogue position, angular-separation invariance and guide IDs.
These are comparisons with published numerical results; no ERFA/SOFA source
implementation is incorporated or claimed as the software used by this chart.

This chart approximates UT1 with UTC and omits proper motion, nutation,
aberration, atmospheric refraction and extinction. It contains neither planets
nor the Moon. Star sizes and tints emphasize recognition, rather than reproducing
a calibrated observation. Those limits remain visible in the chart's information.

## Constellations and original teaching guides

The six lesson figures connect actual HIP identifiers: Orion, Cassiopeia,
the Big Dipper within Ursa Major, a Cygnus cross, Leo and Scorpius. Their line
figures, prose, questions and seasonal chart selections are original material
for this city. The source catalogue remains separately licensed as above.

The [IAU constellation reference](https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx)
distinguishes the 88 bounded sky areas from optional line drawings.
[NASA's asterism explanation](https://science.nasa.gov/solar-system/what-are-asterisms/)
supports the distinction between familiar patterns and constellations. The guide
lines are explicitly **not official IAU boundaries**. The Dipper guide's extra
line toward Polaris is an original pointing aid.

Each guide supplies a recognition task, an explanation and a deeper question
about inference or projection. Scorpius deliberately exposes the latitude limit:
some selected southern tail stars never rise at Prague's latitude. Endpoints
below the horizon stay below it; a whole figure is never forced into the dome.
Changing chart time or reading a guide touches no private data or fixed voices.
