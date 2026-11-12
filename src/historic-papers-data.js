// Curated landmarks, not a ranking of the greatest papers. These are genuine
// first pages from the credited historical editions or publisher PDFs.
const pdm = 'https://creativecommons.org/publicdomain/mark/1.0/';
const image = id => `./assets/papers/${id}.webp`;
const paper = data => Object.freeze({ imageUrl: image(data.id), ...data });

export const HISTORIC_PAPERS = Object.freeze([
  paper({
    id: 'euler', title: 'Solutio problematis ad geometriam situs pertinentis',
    author: 'Leonhard Euler', year: 1741, subject: 'Graphs and topology',
    sourceUrl: 'https://scholarlycommons.pacific.edu/euler-works/53/',
    pdfUrl: 'http://eulerarchive.maa.org/docs/originals/E053.pdf',
    rights: 'Public domain: original eighteenth-century article.', rightsUrl: 'https://scholarlycommons.pacific.edu/euler-works/53/',
    credit: 'Leonhard Euler; Euler Archive, University of the Pacific.',
    why: 'A walk through seven bridges becomes a question about vertex degrees. What information can a diagram discard while preserving the problem?',
    page1based: 1, printedPage: '128',
    scanNote: 'Original Latin article. Written in 1735; published in 1741 in the volume nominally dated 1736. This is not a modern translation.'
  }),
  paper({
    id: 'bayes', title: 'An Essay towards Solving a Problem in the Doctrine of Chances',
    author: 'Thomas Bayes, communicated by Richard Price', year: 1763, subject: 'Probability and inference',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:An_Essay_towards_Solving_a_Problem_in_the_Doctrine_of_Chances._By_the_Late_Rev._Mr._Bayes,_F._R._S._Communicated_by_Mr._Price,_in_a_Letter_to_John_Canton,_A._M._F._R._S._(IA_jstor-105741).pdf',
    pdfUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/An_Essay_towards_Solving_a_Problem_in_the_Doctrine_of_Chances._By_the_Late_Rev._Mr._Bayes%2C_F._R._S._Communicated_by_Mr._Price%2C_in_a_Letter_to_John_Canton%2C_A._M._F._R._S._%28IA_jstor-105741%29.pdf',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Thomas Bayes and Richard Price, Philosophical Transactions 53; JSTOR Early Journal Content scan, Internet Archive / Wikimedia Commons.',
    why: 'Reason backwards from observed events to an unknown probability. Which assumptions turn observations into a defensible inference?',
    page1based: 1, printedPage: '370',
    scanNote: 'Original 1763 printing; the Commons edition removes the later JSTOR cover sheet.'
  }),
  paper({
    id: 'babbage', title: 'A Letter to Sir Humphry Davy on the Application of Machinery to Calculating and Printing Mathematical Tables',
    author: 'Charles Babbage', year: 1822, subject: 'Mechanical computation',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Babbage_-_Letter_to_sir_Humphry_Davy_on_the_application_of_machinery_to_the_purpose_of_calculating_and_printing_mathematical_tables,_1822_-_721620.tif',
    pdfUrl: 'https://gutenberg.beic.it/webclient/DeliveryManager?pid=721620&custom_att_2=simple_viewer',
    format: 'archive', fullLabel: 'Read original pamphlet',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Charles Babbage; BEIC digital library, item 721620; Wikimedia Commons.',
    why: 'Computing and printing are treated as one mechanism, reducing the errors introduced by human copying. Where should verification live in a computing system?',
    page1based: 1, printedPage: 'Title page',
    scanNote: 'The genuine 1822 pamphlet title page, not a newly designed cover. The complete library record links the original pamphlet.'
  }),
  paper({
    id: 'fourier', title: 'Théorie analytique de la chaleur',
    author: 'Joseph Fourier', year: 1822, subject: 'Analysis and mathematical physics',
    sourceUrl: 'https://www.e-rara.ch/zut/doi/10.3931/e-rara-19706',
    pdfUrl: 'https://www.e-rara.ch/download/pdf/6187666.pdf',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Joseph Fourier, Paris, Firmin Didot, 1822; ETH-Bibliothek Zürich, Rar 3978; doi:10.3931/e-rara-19706.',
    why: 'A physical theory of heat leads to representing functions by trigonometric series. When does a useful representation become a theorem?',
    page1based: 34, printedPage: '1',
    scanNote: 'Opening of Chapter I in the original 1822 monograph, not a journal article. E-rara IIIF canvas 6187701 (scan leaf 33). It is PDF page 34 because the full PDF adds an archive metadata cover.'
  }),
  paper({
    id: 'lovelace', title: 'Sketch of the Analytical Engine invented by Charles Babbage, Esq.',
    author: 'Luigi Federico Menabrea; translated and annotated by Ada Lovelace', year: 1843, subject: 'Programs and symbolic machines',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Scientific_Memoirs,_Vol._3_(1843).djvu',
    pdfUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Scientific_Memoirs%2C_Vol._3_%281843%29.djvu',
    format: 'archive', fullLabel: 'Read original volume',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Menabrea and Lovelace, Scientific Memoirs 3, Richard and John E. Taylor, London, 1843; Natural History Museum scan, Internet Archive / Wikimedia Commons.',
    why: 'A programmable machine can separate operations from the quantities they act on. What distinguishes a general method from one worked calculation?',
    page1based: 676, printedPage: '666',
    scanNote: 'First page of the complete translated article, including its contemporary introductory material. Lovelace’s signed notes occur later in the same work.'
  }),
  paper({
    id: 'boole', title: 'The Mathematical Analysis of Logic',
    author: 'George Boole', year: 1847, subject: 'Algebraic logic',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Boole._The_Mathematical_Analysis_of_Logic._Header.png',
    pdfUrl: 'https://books.google.com/books?id=zv4YAQAAIAAJ&printsec=frontcover',
    format: 'archive', fullLabel: 'Read original work',
    rights: 'Public domain; faithful scan of the original 1847 title page.', rightsUrl: pdm,
    credit: 'George Boole, Cambridge: Macmillan, Barclay, & Macmillan, 1847; Wikimedia Commons scan from Google Books.',
    why: 'Logical reasoning is expressed through algebraic operations. Which algebraic laws remain valid when the symbols describe classes rather than ordinary numbers?',
    page1based: 1, printedPage: 'Title page',
    scanNote: 'Genuine 1847 title page. This short monograph is a computing precursor, not an electronic-computer paper.'
  }),
  paper({
    id: 'riemann', title: 'Ueber die Hypothesen, welche der Geometrie zu Grunde liegen',
    author: 'Bernhard Riemann', year: 1867, subject: 'Geometry and manifolds',
    sourceUrl: 'https://www.e-rara.ch/zut/doi/10.3931/e-rara-49481',
    pdfUrl: 'https://www.e-rara.ch/zut/download/pdf/13599718',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Bernhard Riemann, Göttingen: Dieterich, 1867; ETH-Bibliothek Zürich, Rar 07; doi:10.3931/e-rara-49481.',
    why: 'Geometry starts by asking which assumptions determine distance and curvature. Could a different local rule produce a different large-scale world?',
    page1based: 4, printedPage: '1',
    scanNote: 'Opening text page of the original 1867 edition of Riemann’s 1854 lecture. PDF page 2 is the original title page; page 1 is archive metadata.'
  }),
  paper({
    id: 'dedekind', title: 'Stetigkeit und irrationale Zahlen',
    author: 'Richard Dedekind', year: 1872, subject: 'Foundations of the real numbers',
    sourceUrl: 'https://www.e-rara.ch/zut/content/titleinfo/19451236',
    pdfUrl: 'https://www.e-rara.ch/download/pdf/19451236.pdf',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Richard Dedekind, Braunschweig: Friedrich Vieweg und Sohn, 1872; ETH-Bibliothek Zürich, Rar 22802; doi:10.3931/e-rara-71757.',
    why: 'A cut in the rational numbers specifies a real number without relying on a drawn line. Does continuity belong to geometry, arithmetic, or a chosen axiom?',
    page1based: 10, printedPage: 'Title page',
    scanNote: 'Genuine 1872 title page, E-rara IIIF canvas 19451246 (the ninth scan leaf). It is PDF page 10 because the full PDF adds archive metadata before the original leaves.'
  }),
  paper({
    id: 'noether', title: 'Invariante Variationsprobleme',
    author: 'Emmy Noether', year: 1918, subject: 'Symmetry and conservation',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:InvarianteVariationsprobleme.djvu',
    pdfUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/InvarianteVariationsprobleme.djvu',
    format: 'archive', fullLabel: 'Read original article',
    rights: 'Public domain; Public Domain Mark 1.0.', rightsUrl: pdm,
    credit: 'Emmy Noether, Nachrichten der Königlichen Gesellschaft der Wissenschaften zu Göttingen, 1918, pp. 235–257; Michigan scan / Wikimedia Commons.',
    why: 'Continuous symmetries of a variational problem constrain its conserved quantities. Which conditions are required before a symmetry yields a conservation law?',
    page1based: 1, printedPage: '235',
    scanNote: 'Original German article, first page. The later English translation is not used.'
  }),
  paper({
    id: 'scikit-learn', title: 'Scikit-learn: Machine Learning in Python',
    author: 'Fabian Pedregosa, Gaël Varoquaux, Alexandre Gramfort and colleagues', year: 2011, subject: 'Scientific computing and reproducibility',
    sourceUrl: 'https://jmlr.org/papers/v12/pedregosa11a.html',
    pdfUrl: 'https://jmlr.org/papers/volume12/pedregosa11a/pedregosa11a.pdf',
    rights: 'Copyright © 2011 the authors; CC BY under JMLR’s publication policy (version not specified).',
    rightsUrl: 'https://jmlr.org/author-info.html#publication',
    credit: 'Fabian Pedregosa et al., Journal of Machine Learning Research 12(85), 2825–2830, 2011; publisher PDF. Rendered as WebP; content unchanged.',
    why: 'A common software interface makes many learning algorithms usable and comparable. How do defaults, pipelines and evaluation choices affect the conclusions a tool encourages?',
    page1based: 1, printedPage: '2825',
    scanNote: 'Actual publisher first page, including its full author list. The paper’s reuse policy is distinct from the software’s BSD license.'
  }),
  paper({
    id: 'dropout', title: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',
    author: 'Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever and Ruslan Salakhutdinov', year: 2014, subject: 'Statistical learning',
    sourceUrl: 'https://jmlr.org/papers/v15/srivastava14a.html',
    pdfUrl: 'https://jmlr.org/papers/volume15/srivastava14a/srivastava14a.pdf',
    rights: 'Copyright © 2014 the authors; CC BY under JMLR’s publication policy (version not specified).',
    rightsUrl: 'https://jmlr.org/author-info.html#publication',
    credit: 'Nitish Srivastava et al., Journal of Machine Learning Research 15(56), 1929–1958, 2014; publisher PDF. Rendered as WebP; content unchanged.',
    why: 'Randomly removing units during training can improve generalization. Why does deliberate disruption help, and when does the ensemble analogy stop being exact?',
    page1based: 1, printedPage: '1929',
    scanNote: 'Actual publisher first page, including abstract and original copyright attribution.'
  })
]);
