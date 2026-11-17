// Original historical editions: opening text leaves, never invented covers or
// modern translations. The fuller provenance and hashes live in
// docs/PAPER-CLASSICAL-EXTENSION.md. This is a curated route, not a ranking.
const pdm = 'https://creativecommons.org/publicdomain/mark/1.0/';
const paper = data => Object.freeze({ imageUrl: `./assets/papers/${data.id}.webp`, ...data });

export const CLASSICAL_PAPERS = Object.freeze([
  paper({
    id: 'frege-begriffsschrift', floorId: 'foundations',
    title: 'Begriffsschrift: eine der arithmetischen nachgebildete Formelsprache des reinen Denkens',
    author: 'Gottlob Frege', year: 1879, subject: 'Quantification and formal proof',
    sourceUrl: 'https://gdz.sub.uni-goettingen.de/id/PPN538957069',
    pdfUrl: 'https://zenodo.org/records/6330677/files/Y_1879_frege_begriffsschrift_OCR.pdf?download=1',
    rights: 'Public domain: original 1879 work; faithful original scan. Commons identifies the original edition with Public Domain Mark 1.0.',
    rightsUrl: 'https://commons.wikimedia.org/wiki/File:Begriffsschrift.djvu',
    credit: 'Gottlob Frege, Halle: Louis Nebert, 1879; SUB Göttingen scan, PPN538957069; original-page facsimile distributed in Zenodo record 6330677.',
    why: 'A notation must distinguish a variable from a judgment about it; which steps of an ordinary mathematical argument survive when every inference must be made explicit?',
    page1based: 13, printedPage: '1',
    scanNote: 'Opening of Part I, Erklärung der Bezeichnungen, in the original German monograph. The PDF contains modern archive/editorial leaves before the historical scan; none of those leaves are displayed. No modern English translation is used.'
  }),
  paper({
    id: 'peano-arithmetic', floorId: 'foundations',
    title: 'Arithmetices principia, nova methodo exposita',
    author: 'Giuseppe Peano', year: 1889, subject: 'Axioms, notation and arithmetic',
    sourceUrl: 'https://archive.org/details/arithmeticespri00peangoog',
    pdfUrl: 'https://archive.org/download/arithmeticespri00peangoog/arithmeticespri00peangoog.pdf',
    rights: 'Public domain: original 1889 Latin work, published before 1931; author died in 1932. Faithful mechanical scan.',
    rightsUrl: 'https://commons.wikimedia.org/wiki/File:Arithmetices_principia_Properties_of_equality.png',
    credit: 'Giuseppe Peano, Turin: Fratres Bocca, 1889; Harvard University copy, Google digitization / Internet Archive, arithmeticespri00peangoog.',
    why: 'Axioms only become usable after their symbols and inference conventions are fixed; which properties of number are assumptions, and which can be derived?',
    page1based: 14, printedPage: 'VII (opening logical notation, unnumbered)',
    scanNote: 'Original Latin monograph: opening of Logicae notationes, before the separately paginated arithmetic section. This is an opening text leaf, not the title page and not a claim that the nine arithmetic axioms appear on this leaf. Original footer is retained.'
  }),
  paper({
    id: 'hilbert-problems', floorId: 'foundations',
    title: 'Mathematische Probleme', author: 'David Hilbert', year: 1900,
    subject: 'Axioms and the research frontier',
    sourceUrl: 'https://gdz.sub.uni-goettingen.de/id/PPN252457811_1900?tify=%7B%22pages%22%3A%5B269%5D%7D',
    pdfUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Hilbert_-_Mathematische_Probleme.pdf',
    rights: 'Public domain; Public Domain Mark 1.0. Original 1900 article.',
    rightsUrl: 'https://commons.wikimedia.org/wiki/File:Hilbert_-_Mathematische_Probleme.pdf',
    credit: 'David Hilbert, Göttinger Nachrichten, Mathematisch-physikalische Klasse, 1900, pp. 253–297; SUB Göttingen / GDZ, PPN252457811_1900, scan 269.',
    why: 'A powerful research problem can expose the limits of its own assumptions; which of Hilbert’s requests ask for a construction, a proof, or a decision procedure?',
    page1based: 2, printedPage: '253',
    scanNote: 'Actual first page of the original German article, acquired directly as GDZ scan 269. It is page 2 in the linked Commons article PDF because that PDF begins with an archive cover.'
  }),
  paper({
    id: 'bolzano-continuity', floorId: 'foundations',
    title: 'Rein analytischer Beweis des Lehrsatzes, dass zwischen je zwey Werthen, die ein entgegengesetztes Resultat gewähren, wenigstens eine reelle Wurzel der Gleichung liege',
    author: 'Bernard Bolzano', year: 1817, subject: 'Continuity and proof without a picture',
    sourceUrl: 'https://www.e-rara.ch/zut/doi/10.3931/e-rara-100813',
    pdfUrl: 'https://www.e-rara.ch/download/pdf/27886662.pdf',
    rights: 'Public domain; Public Domain Mark 1.0, explicitly declared in the ETH archive METS record.', rightsUrl: pdm,
    credit: 'Bernard Bolzano, Prague: Gottlieb Haase, 1817, first edition; ETH-Bibliothek Zürich, Rar 10776; doi:10.3931/e-rara-100813.',
    why: 'A curve crossing a line may persuade the eye without proving a theorem; exactly which notion of continuity can replace that picture in an analytic argument?',
    page1based: 4, printedPage: '3 (opening preface, unnumbered)',
    scanNote: 'Opening Vorrede of the original 1817 pamphlet, bound in a composite volume. E-rara adds one metadata cover before the historical leaves. This monitor is honestly a monograph’s opening preface, not a journal article or a modern reprint.'
  }),
  paper({
    id: 'gauss-curvature', floorId: 'geometry',
    title: 'Disquisitiones generales circa superficies curvas',
    author: 'Carl Friedrich Gauss', year: 1828, subject: 'Intrinsic geometry and curvature',
    sourceUrl: 'https://www.e-rara.ch/zut/doi/10.3931/e-rara-59755',
    pdfUrl: 'https://www.e-rara.ch/zut/download/pdf/16144729',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Carl Friedrich Gauss, Göttingen: Dieterich, 1828; ETH-Bibliothek Zürich, Rar 21533; doi:10.3931/e-rara-59755.',
    why: 'Distances measured entirely within a surface can determine its curvature; which geometric facts can an inhabitant discover without seeing the surrounding space?',
    page1based: 8, printedPage: 'Opening text, signature A2',
    scanNote: 'First text page of the original Latin 1828 separate printing, following the title and blank leaves; read to the Royal Society on 8 October 1827. E-rara IIIF canvas 16144737, seventh original scan leaf; the full PDF adds one metadata cover.'
  }),
  paper({
    id: 'klein-erlangen', floorId: 'geometry',
    title: 'Vergleichende Betrachtungen über neuere geometrische Forschungen',
    author: 'Felix Klein', year: 1872, subject: 'Geometry as invariants under transformations',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vergleichende_betrachtungen_%C3%BCber_neuere_geometrische_forsuchungen_.._(IA_abn7632.0001.001.umich.edu).pdf',
    pdfUrl: 'https://archive.org/download/abn7632.0001.001.umich.edu/abn7632.0001.001.umich.edu.pdf',
    rights: 'Public domain: original 1872 work, published before 1931; author died in 1925. Commons marks the faithful scan public domain.',
    rightsUrl: 'https://commons.wikimedia.org/wiki/File:Vergleichende_betrachtungen_%C3%BCber_neuere_geometrische_forsuchungen_.._(IA_abn7632.0001.001.umich.edu).pdf',
    credit: 'Felix Klein, Erlangen: Andreas Deichert, 1872; University of Michigan copy, Internet Archive abn7632.0001.001.umich.edu / Wikimedia Commons.',
    why: 'Changing the allowed transformation group changes what counts as the same figure; which properties survive a rigid motion but fail under a projective transformation?',
    page1based: 4, printedPage: '3 (opening text, unnumbered)',
    scanNote: 'Opening text of the original 1872 German Erlangen Programme, after its title and imprint. The first PDF page is modern library catalogue metadata and is not displayed.'
  }),
  paper({
    id: 'euclid-elements', floorId: 'geometry',
    title: 'Elementa: opening of Book I',
    author: 'Euclid; Latin tradition of Adelard of Bath and Campanus of Novara', year: 1482,
    subject: 'Definitions, construction and deductive geometry',
    sourceUrl: 'https://www.e-rara.ch/zut/content/titleinfo/2553854',
    pdfUrl: 'https://www.e-rara.ch/download/pdf/2553854.pdf',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Euclid, Latin edition with Campanus’s commentary; Venice: Erhard Ratdolt, 1482; ETH-Bibliothek Zürich, Rar 1919; doi:10.3931/e-rara-8935.',
    why: 'A diagram illustrates a construction but does not settle its logical dependencies; which later claims actually require the parallel postulate?',
    page1based: 8, printedPage: 'Unpaginated opening of Book I',
    scanNote: 'Original 1482 printed opening of Book I, with its ornamental border and geometric diagrams. This is a historical Latin edition of an ancient work, not a claim that Euclid lived in 1482. E-rara IIIF canvas 2553863, seventh original leaf; full PDF adds one archive cover.'
  }),
  paper({
    id: 'euler-polyhedra', floorId: 'geometry',
    title: 'Elementa doctrinae solidorum', author: 'Leonhard Euler', year: 1758,
    subject: 'Polyhedra and topological invariants',
    sourceUrl: 'https://scholarlycommons.pacific.edu/euler-works/230/',
    pdfUrl: 'https://archive.org/download/novicommentar417521753imp/novicommentar417521753imp.pdf',
    rights: 'Public domain: original eighteenth-century article and faithful mechanical scan; author died in 1783.',
    rightsUrl: 'https://commons.wikimedia.org/wiki/File:Euler_Polyeder.pdf',
    credit: 'Leonhard Euler, Novi Commentarii Academiae Scientiarum Imperialis Petropolitanae 4, 1758, pp. 109–140, Eneström E230; original volume scan, Internet Archive novicommentar417521753imp.',
    why: 'Counting vertices, edges and faces suggests an invariant, but the class of permitted solids matters; what changes when a surface acquires a handle?',
    page1based: 189, printedPage: '109',
    scanNote: 'First page of the original Latin article in its 1758 journal volume, not the later Opera Omnia reprint or a modern translation. The journal volume is nominally dated 1752–1753; the Euler Archive records publication in 1758.'
  })
]);
