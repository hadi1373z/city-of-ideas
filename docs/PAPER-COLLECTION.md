# Faculty first-page collection

The 35 lower-gallery panels display a curated selection of mathematical and
computational landmarks across four physical floors (6 / 8 / 6 / 7). The
selection is not a claim to identify the greatest papers. It mixes original
articles, historical editions and short monographs, and modern
computer-science articles. `src/historic-papers-data.js` is the shared record for
titles, author credits, editions, discussion questions, source links and rights.
It retains the original eleven catalogue records, then appends
`historic-papers-classical-data.js` and `historic-papers-modern-data.js`.

The images in `src/assets/papers/` are faithful scan/PDF renderings, converted to
WebP. No generated cover or invented first-page text is used. Original title
pages are explicitly identified as title pages in the record; they are not
presented as an article's abstract. German, French and Latin originals are left
intact, with English contextual questions outside the facsimile.

The table below records the preserved initial eleven works. The classical
extension adds Frege, Peano, Bolzano and Hilbert to foundations, and a historical
Euclid edition, Euler on polyhedra, Gauss and Klein to geometry. Its individual
records identify the exact original editions, selected leaves and public-domain
reuse sources. The modern extension adds kernel ICA, LIBLINEAR, AdaGrad and
SDCA to computation; LDA, feature selection, forest consistency and the kernel
two-sample test to learning. Each JMLR first page retains author attribution and
copyright under the publisher's CC BY policy; no licence version is invented.

Every work has a separate compact `.display.webp` for its permanent 3D frame.
The full first-page asset and original-work link remain available in the reader.
Compact adaptation changes image resolution only, preserving all page content.

| ID | Work / edition | Selected original page | Primary source and reuse record |
| --- | --- | --- | --- |
| euler | Euler, bridge problem, 1741 | Original Latin article p. 128; PDF page 1 | [Euler Archive record](https://scholarlycommons.pacific.edu/euler-works/53/) and [original PDF](http://eulerarchive.maa.org/docs/originals/E053.pdf). The original eighteenth-century work is public domain. The archive distinguishes its 1735 composition and 1741 publication from the volume's nominal 1736 date. Its modern English translation is not used. |
| bayes | Bayes, communicated by Price, 1763 | p. 370; first article page including Price's introductory letter | [Commons source and Public Domain Mark](https://commons.wikimedia.org/wiki/File:An_Essay_towards_Solving_a_Problem_in_the_Doctrine_of_Chances._By_the_Late_Rev._Mr._Bayes,_F._R._S._Communicated_by_Mr._Price,_in_a_Letter_to_John_Canton,_A._M._F._R._S._(IA_jstor-105741).pdf). This version removes the later JSTOR cover. |
| babbage | Letter to Sir Humphry Davy, 1822 | Genuine original pamphlet title page | [BEIC partnership scan and Public Domain Mark](https://commons.wikimedia.org/wiki/File:Babbage_-_Letter_to_sir_Humphry_Davy_on_the_application_of_machinery_to_the_purpose_of_calculating_and_printing_mathematical_tables,_1822_-_721620.tif); item 721620. The full-work link opens the BEIC pamphlet reader. |
| fourier | *Théorie analytique de la chaleur*, 1822 | Chapter I, p. 1; IIIF canvas 6187701, scan leaf 33 / PDF page 34 | [ETH-Bibliothek Zürich, Rar 3978; Public Domain Mark](https://www.e-rara.ch/zut/doi/10.3931/e-rara-19706). This is a monograph, not a journal article. |
| lovelace | Menabrea translated and annotated by Lovelace, 1843 | Complete article's opening, printed p. 666; DjVu leaf 676 | [Original volume scan and Public Domain Mark](https://commons.wikimedia.org/wiki/File:Scientific_Memoirs,_Vol._3_(1843).djvu). Natural History Museum copy via Internet Archive. This page precedes Lovelace's signed notes; the credit identifies both contributors. |
| boole | *The Mathematical Analysis of Logic*, 1847 | Genuine original title page | [Commons scan and public-domain notice](https://commons.wikimedia.org/wiki/File:Boole._The_Mathematical_Analysis_of_Logic._Header.png), from the original Google Books volume. The later Library of Congress 1948 facsimile was researched but is not the displayed asset. |
| riemann | *Ueber die Hypothesen…*, 1867 printing of the 1854 lecture | Original opening text p. 1; archive PDF page 4 | [ETH-Bibliothek Zürich, Rar 07; Public Domain Mark](https://www.e-rara.ch/zut/doi/10.3931/e-rara-49481). Archive PDF page 1 is modern metadata; page 2 is the original title page. Neither is mistaken for the article opening. |
| dedekind | *Stetigkeit und irrationale Zahlen*, 1872 | Genuine original title page; IIIF canvas 19451246, scan leaf 9 / PDF page 10 | [ETH-Bibliothek Zürich, Rar 22802; Public Domain Mark](https://www.e-rara.ch/zut/content/titleinfo/19451236). A short foundational monograph. |
| noether | *Invariante Variationsprobleme*, 1918 | Original German article p. 235; DjVu leaf 1 | [Original scan and Public Domain Mark](https://commons.wikimedia.org/wiki/File:InvarianteVariationsprobleme.djvu). The modern English translation is not used. |
| scikit-learn | Pedregosa et al., 2011 | Publisher PDF page 1, p. 2825, including the full author list | [Publisher article](https://jmlr.org/papers/v12/pedregosa11a.html). Author copyright retained; [JMLR's publication policy](https://jmlr.org/author-info.html#publication) grants CC BY to the public. The policy does not specify a version, so the record does not invent one. The paper's license is distinct from the software's BSD license. |
| dropout | Srivastava et al., 2014 | Publisher PDF page 1, p. 1929 | [Publisher article](https://jmlr.org/papers/v15/srivastava14a.html), with the same [JMLR CC BY policy](https://jmlr.org/author-info.html#publication). Retain the original copyright statement and author attribution. |

Every displayed page was visually checked against its title, author, publication
and page selection during preparation. First-page renderings preserve the page's
content and attribution. ETH requests the author, holding institution, shelfmark
and persistent identifier as the normal source credit; these are retained in the
manifest. No emails or notifications were sent on the user's behalf.

Poincaré's *Analysis situs* and Cantor's 1874 paper were considered but not shipped
in this set: the available scans did not offer as clear an archive-specific
reuse statement as the selected ETH public-domain replacements. Public access
to a modern paper, arXiv record, course PDF or modern translation is never by
itself treated as reuse permission.

## Eight modern mathematical detours - 18 November 2026

The previous 27 records and full-page files remain unchanged. Eight additional
publisher first pages expand the four physical floors to 8 / 10 / 8 / 9 pages.
These are deliberate modern connections, not a claim to rank all historical
mathematics and computer science.

| Floor | New papers | Why this pair |
| --- | --- | --- |
| Foundations and logic | Bousquet & Elisseeff (2002), Stability and Generalization; Shalev-Shwartz et al. (2010), Learnability, Stability and Uniform Convergence | A sensitivity condition can support a theorem; a familiar proof route can also fail in a broader setting. |
| Geometry, analysis and symmetry | Bubenik (2015), Persistence Landscapes; Chazal et al. (2015), Persistence Diagram Estimation | Move from a picture of holes to functional summaries and statistical estimation of shape. |
| Machines and symbolic computation | Kalai & Vempala (2002), Universal Portfolios; Bach (2017), Kernel Quadrature and Random Features | Non-uniform sampling makes enormous mathematical objects computable; integration and kernel approximation share an operator viewpoint. |
| Probability and learning | Shafer & Vovk (2008), Conformal Prediction; Peters et al. (2014), Additive Noise Models | Contrast a predictive coverage statement with a causal identifiability statement and their different assumptions. |

Each has an original short hook, a description, prerequisites, an assumption
boundary and a question. New physical captions display the hook, while the
gated reader shows the full source, original page and qualifications. Floor
reading guides show short descriptions without expanding every entry.

Publisher records and PDFs are linked in historic-papers-surprises-data.js.
JMLR author-info.html#publication grants CC BY while retaining author copyright.
Bach explicitly prints CC BY 4.0 on the first page; other entries do not invent
a licence version. All eight first pages were visually checked for title,
authors, printed page and intact attribution. Their full PDF hashes and exact
WebP hashes are recorded in assets/papers/surprises-provenance.json.
Full facsimiles are 1600px high; separate 800px room images keep all35 page
textures to 19,744,188 decoded pixels. Existing original images are unchanged.

The assertions in paper-detours.mjs check category membership, unique physical
slots, paired questions, concise commentary, source hashes and original-page
credit. The existing gallery runtime walks to all35 displays in both directions,
including the real west exit, under physical sculpture and frame collisions.
