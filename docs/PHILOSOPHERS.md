# Philosophers’ quarter

Six original architectural interpretations occupy previously empty western lots: Plato’s academy courtyard, Aristotle’s colonnaded porch, Epicurus’ garden pergola, Hypatia’s open observatory, Confucius’ courtyard and Ibn Sina’s library. These are imaginative study spaces, not historical reconstructions. Existing homes and source collections are retained.

The quarter shares the existing renderer, controls, collision system, ray targets, render batching and bilingual interface. Every doorway opens onto a continuous road connected to the object market. Welcome and walking controls offer a directory; the map shows the quarter and can turn the visitor toward it. Concept objects and books open the relevant guide without changing the visitor’s position.

Public descriptions and exercises are original English/Persian prose, with source links to the Stanford Encyclopedia of Philosophy and the University of St Andrews’ MacTutor. Hypatia’s guide explicitly distinguishes the limited surviving evidence from the imagined exhibit. Reflection notes use a separate per-philosopher local-storage key, stay on the browser, and preserve authored text across language changes. Storage failure is reported in the dialog. No account API or existing private archive is accessed.

Validation: the geometry test samples connected roads and all six entrance-to-study routes every six centimetres, checks walls and furniture, and verifies bilingual guide data and source URLs. Browser checks exercised the directory and actual keyboard movement through all six doors, English/Persian switching, reflection persistence after reload, a single shared walking canvas and the 390-pixel mobile layout. Full repository release checks run before deployment.
