
// Bounded source adapters for a continuous scene; no renderer, backend, or saved data.
// House of Ideas source commit 48ccb361e8e64857f4e9f94f4598d8dc97970e00.
(function(g){
'use strict';
const THREE=g.THREE;
if(!THREE||String(THREE.REVISION)!=='160')throw Error('CITY_SOURCES requires the already loaded Three.js r160.');
const ARTISTS=[{"id":"monet","name":"Claude Monet","color":"#507258","background":"#f2f1e9","description":"An invitation to stay a little longer with what changes.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#monet","approach":"Look around the painting before settling at its center. Is there a horizon? Where does one surface end and another begin?\n\nTry naming three kinds of mark: a floating leaf, a reflection, a stroke that refuses to become either. The uncertainty is part of what makes the image worth staying with.","works":[{"id":"water-lilies","title":"Water Lilies","date":"1906","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_water-lilies.webp","alt":"Water Lilies. A pond fills the frame.","description":"A pond fills the frame. Floating leaves interrupt a field of reflected sky; distance is suggested by color rather than a horizon.","sourceUrl":"https://api.artic.edu/api/v1/artworks/16568","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg","citation":"Claude Monet, Water Lilies, 1906. Oil on canvas. Art Institute of Chicago. https://api.artic.edu/api/v1/artworks/16568","dimensions":"89.9 × 94.1 cm","collection":"Art Institute of Chicago","originalImageUrl":"./art-city/artworks/monet_water-lilies.webp"},{"id":"impression-sunrise","title":"Impression, Sunrise","date":"1872","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_impression-sunrise.webp","alt":"Impression, Sunrise. A small orange sun and its reflection hold their place against a harbor of blue-gray strokes.","description":"A small orange sun and its reflection hold their place against a harbor of blue-gray strokes. Boats arrive as dark, economical silhouettes.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","citation":"Claude Monet, Impression, Sunrise, 1872. Oil on canvas. Musée Marmottan Monet. https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","dimensions":"48 × 63 cm","collection":"Musée Marmottan Monet","originalImageUrl":"./art-city/artworks/monet_impression-sunrise.webp"},{"id":"woman-with-a-parasol","title":"Woman with a Parasol — Madame Monet and Her Son","date":"1875","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_woman-with-a-parasol.webp","alt":"Woman with a Parasol — Madame Monet and Her Son. The viewpoint is low and the sky expansive.","description":"The viewpoint is low and the sky expansive. Dress, grass, and clouds appear caught in the same movement of air.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","citation":"Claude Monet, Woman with a Parasol — Madame Monet and Her Son, 1875. Oil on canvas. National Gallery of Art. https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","dimensions":"100 × 81 cm","collection":"National Gallery of Art","originalImageUrl":"./art-city/artworks/monet_woman-with-a-parasol.webp"},{"id":"poppy-field","title":"Poppy Field","date":"1873","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_poppy-field.webp","alt":"Poppy Field. Bright red marks lead the eye through pale grasses.","description":"Bright red marks lead the eye through pale grasses. The figures are part of the field’s rhythm, not isolated from it.","sourceUrl":"https://www.musee-orsay.fr/en/artworks/coquelicots-1010","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Poppy_Field_-_Google_Art_Project.jpg","citation":"Claude Monet, Poppy Field, 1873. Oil on canvas. Musée d’Orsay. https://www.musee-orsay.fr/en/artworks/coquelicots-1010","dimensions":"50 × 65 cm","collection":"Musée d’Orsay","originalImageUrl":"./art-city/artworks/monet_poppy-field.webp"},{"id":"japanese-footbridge","title":"The Japanese Footbridge","date":"1899","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_japanese-footbridge.webp","alt":"The Japanese Footbridge. The bridge draws a firm arc through foliage.","description":"The bridge draws a firm arc through foliage. Beneath it, floating plants and reflections loosen the distinction between solid and liquid.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","citation":"Claude Monet, The Japanese Footbridge, 1899. Oil on canvas. National Gallery of Art. https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","dimensions":"81.3 × 101.6 cm","collection":"National Gallery of Art","originalImageUrl":"./art-city/artworks/monet_japanese-footbridge.webp"},{"id":"water-lilies-and-bridge","title":"Water Lilies and Japanese Bridge","date":"1899","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_water-lilies-and-bridge.webp","alt":"Water Lilies and Japanese Bridge. The garden closes around a footbridge, while the pool opens another space below.","description":"The garden closes around a footbridge, while the pool opens another space below. Similar greens take on different weights in water and air.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","citation":"Claude Monet, Water Lilies and Japanese Bridge, 1899. Oil on canvas. Princeton University Art Museum. https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","dimensions":"90.5 × 89.7 cm","collection":"Princeton University Art Museum","originalImageUrl":"./art-city/artworks/monet_water-lilies-and-bridge.webp"}]},{"id":"kandinsky","name":"Wassily Kandinsky","color":"#bc2924","background":"#eae6db","description":"Paintings arranged as encounters between pressure, interval, and color.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#kandinsky","approach":"A small interactive composition made for this website, not a work by Kandinsky. Move the blue circle and observe how the interval changes.","works":[{"id":"composition-eight","title":"Composition VIII","date":"1923","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_composition-eight.webp","alt":"Composition VIII. Circles, triangles, arcs, and diagonals share a pale field.","description":"Circles, triangles, arcs, and diagonals share a pale field. The composition has both the precision of a diagram and the unstable balance of a performance.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","citation":"Wassily Kandinsky, Composition VIII, 1923. Oil on canvas. Solomon R. Guggenheim Museum. https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","dimensions":"140 × 201 cm","collection":"Solomon R. Guggenheim Museum","originalImageUrl":"./art-city/artworks/kandinsky_composition-eight.webp"},{"id":"composition-seven","title":"Composition VII","date":"1913","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_composition-seven.webp","alt":"Composition VII. A dense current of marks resists a single focal point.","description":"A dense current of marks resists a single focal point. The painting opens through repeated looking: a pale passage, a dark knot, a sudden turn.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","citation":"Wassily Kandinsky, Composition VII, 1913. Oil on canvas. State Tretyakov Gallery. https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","dimensions":"Approx. 200 × 300 cm","collection":"State Tretyakov Gallery","originalImageUrl":"./art-city/artworks/kandinsky_composition-seven.webp"},{"id":"yellow-red-blue","title":"Yellow–Red–Blue","date":"1925","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_yellow-red-blue.webp","alt":"Yellow–Red–Blue. A yellow structure and a large blue circle pull in different directions.","description":"A yellow structure and a large blue circle pull in different directions. Lines cross the space between them like another layer of thought.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","citation":"Wassily Kandinsky, Yellow–Red–Blue, 1925. Oil on canvas. Centre Pompidou. https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","dimensions":"128 × 201.5 cm","collection":"Centre Pompidou","originalImageUrl":"./art-city/artworks/kandinsky_yellow-red-blue.webp"},{"id":"several-circles","title":"Several Circles","date":"1926","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_several-circles.webp","alt":"Several Circles. Translucent discs overlap against a dark ground.","description":"Translucent discs overlap against a dark ground. Color becomes luminous at their edges, suggesting depth without a conventional setting.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","citation":"Wassily Kandinsky, Several Circles, 1926. Oil on canvas. Solomon R. Guggenheim Museum. https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","dimensions":"140.3 × 140.7 cm","collection":"Solomon R. Guggenheim Museum","originalImageUrl":"./art-city/artworks/kandinsky_several-circles.webp"},{"id":"black-and-violet","title":"Black and Violet","date":"1923","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_black-and-violet.webp","alt":"Black and Violet. Large dark forms are held in tension by fine lines and small accents.","description":"Large dark forms are held in tension by fine lines and small accents. The open background is an active part of the arrangement.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","citation":"Wassily Kandinsky, Black and Violet, 1923. Oil on canvas. See source record. https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","dimensions":"77.8 × 100.4 cm","collection":"See source record","originalImageUrl":"./art-city/artworks/kandinsky_black-and-violet.webp"},{"id":"study-seven","title":"Study for Composition VII, No. 2","date":"1913","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_study-seven.webp","alt":"Study for Composition VII, No. 2. An expansive study in which color masses gather, dissolve, and change direction.","description":"An expansive study in which color masses gather, dissolve, and change direction. Its loose passages make the process of composition visible.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","citation":"Wassily Kandinsky, Study for Composition VII, No. 2, 1913. Oil on canvas. Lenbachhaus. https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","dimensions":"100 × 140 cm","collection":"Lenbachhaus","originalImageUrl":"./art-city/artworks/kandinsky_study-seven.webp"}]},{"id":"van-gogh","name":"Vincent van Gogh","color":"#945a1c","background":"#f8f1df","description":"A room, a branch, a field. There is always another way to look at an ordinary thing.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#van-gogh","approach":"Read about a painting beside a letter from the same period. Notice the practical questions: a color choice, the cost of materials, the work of another artist.\n\nThe scholarly edition of Van Gogh’s letters includes transcriptions, translations, annotations, and illustrations. This site links to that edition instead of inventing a voice for the artist.","works":[{"id":"starry-night","title":"The Starry Night","date":"1889","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_starry-night.webp","alt":"The Starry Night. The sky occupies most of the canvas.","description":"The sky occupies most of the canvas. Curves of blue and pale yellow sweep past the upright cypress and the quieter geometry of the village.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, The Starry Night, 1889. Oil on canvas. The Museum of Modern Art. https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","dimensions":"73.7 × 92.1 cm","collection":"The Museum of Modern Art","originalImageUrl":"./art-city/artworks/van-gogh_starry-night.webp"},{"id":"almond-blossom","title":"Almond Blossom","date":"1890","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_almond-blossom.webp","alt":"Almond Blossom. Pale blossoms spread across an uninterrupted blue.","description":"Pale blossoms spread across an uninterrupted blue. The branches make a network that can be followed from one edge of the painting to another.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, Almond Blossom, 1890. Oil on canvas. Van Gogh Museum. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","dimensions":"73.3 × 92.4 cm","collection":"Van Gogh Museum","originalImageUrl":"./art-city/artworks/van-gogh_almond-blossom.webp"},{"id":"sunflowers","title":"Sunflowers (Munich version)","date":"1888","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_sunflowers.webp","alt":"Sunflowers (Munich version). Petals, seeds, and leaves give each flower a different texture.","description":"Petals, seeds, and leaves give each flower a different texture. The vase gathers them into a still life that remains full of irregular movement.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","citation":"Vincent van Gogh, Sunflowers (Munich version), 1888. Oil on canvas. Neue Pinakothek. https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","dimensions":"91 × 72 cm","collection":"Neue Pinakothek","originalImageUrl":"./art-city/artworks/van-gogh_sunflowers.webp"},{"id":"rhone","title":"Starry Night over the Rhône","date":"1888","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_rhone.webp","alt":"Starry Night over the Rhône. Points of light stretch into the river.","description":"Points of light stretch into the river. Above and below the horizon, short yellow strokes turn darkness into a sequence of reflections.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, Starry Night over the Rhône, 1888. Oil on canvas. Musée d’Orsay. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","dimensions":"72.5 × 92 cm","collection":"Musée d’Orsay","originalImageUrl":"./art-city/artworks/van-gogh_rhone.webp"},{"id":"bedroom","title":"The Bedroom","date":"1888","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_bedroom.webp","alt":"The Bedroom. The room is built from strongly outlined furniture and tilted planes.","description":"The room is built from strongly outlined furniture and tilted planes. Empty space around the bed becomes as distinctive as the objects themselves.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, The Bedroom, 1888. Oil on canvas. Van Gogh Museum. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","dimensions":"72 × 90 cm","collection":"Van Gogh Museum","originalImageUrl":"./art-city/artworks/van-gogh_bedroom.webp"},{"id":"wheatfield","title":"Wheatfield with Crows","date":"1890","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_wheatfield.webp","alt":"Wheatfield with Crows. Paths interrupt the gold of the field while dark birds mark the sky.","description":"Paths interrupt the gold of the field while dark birds mark the sky. The wide format places the viewer close to an unresolved stretch of land.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, Wheatfield with Crows, 1890. Oil on canvas. Van Gogh Museum. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","dimensions":"50.2 × 103 cm","collection":"Van Gogh Museum","originalImageUrl":"./art-city/artworks/van-gogh_wheatfield.webp"}]},{"id":"hokusai","name":"Katsushika Hokusai","color":"#ad4134","background":"#efe9db","description":"A changing foreground. A mountain that remains.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#hokusai","approach":"The same design can survive in multiple impressions. Paper size, color, wear, cropping, and the condition of the blocks can differ. Compare the particular impression rather than assuming every reproduction describes an identical sheet.","works":[{"id":"great-wave","title":"Under the Wave off Kanagawa","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_great-wave.webp","alt":"Under the Wave off Kanagawa. The wave curls over the boats, while Mount Fuji sits inside the opening below it.","description":"The wave curls over the boats, while Mount Fuji sits inside the opening below it. The small distant mountain and the immense foreground wave share a pointed profile.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","citation":"Katsushika Hokusai, Under the Wave off Kanagawa, c. 1830–1832. Color woodblock print on paper. See impression record. https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","dimensions":"Horizontal ōban; dimensions vary by impression","collection":"See impression record","originalImageUrl":"./art-city/artworks/hokusai_great-wave.webp"},{"id":"red-fuji","title":"Fine Wind, Clear Morning","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_red-fuji.webp","alt":"Fine Wind, Clear Morning. The mountain’s red slope meets a blue sky patterned with white clouds.","description":"The mountain’s red slope meets a blue sky patterned with white clouds. Human activity disappears, leaving large planes of color and the shape of the summit.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","citation":"Katsushika Hokusai, Fine Wind, Clear Morning, c. 1830–1832. Color woodblock print on paper. Indianapolis Museum of Art at Newfields. https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","dimensions":"26 × 38 cm (this impression)","collection":"Indianapolis Museum of Art at Newfields","originalImageUrl":"./art-city/artworks/hokusai_red-fuji.webp"},{"id":"kajikazawa","title":"Kajikazawa in Kai Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_kajikazawa.webp","alt":"Kajikazawa in Kai Province. Fishing lines extend from a rocky ledge toward moving water.","description":"Fishing lines extend from a rocky ledge toward moving water. Their triangular arrangement answers the outline of Fuji beyond.","sourceUrl":"https://www.metmuseum.org/art/collection/search/56727","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Kajikazawa_in_Kai_Province_(Koshu_Kajikazawa).jpg","citation":"Katsushika Hokusai, Kajikazawa in Kai Province, c. 1830–1832. Color woodblock print on paper. See impression record. https://www.metmuseum.org/art/collection/search/56727","dimensions":"Horizontal ōban; dimensions vary by impression","collection":"See impression record","originalImageUrl":"./art-city/artworks/hokusai_kajikazawa.webp"},{"id":"ejiri","title":"Ejiri in Suruga Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_ejiri.webp","alt":"Ejiri in Suruga Province. Wind lifts papers and bends the trees along a winding path.","description":"Wind lifts papers and bends the trees along a winding path. Fuji remains still on the horizon, a counterpoint to the foreground’s agitation.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","rights":"The Metropolitan Museum of Art, Henry L. Phillips Collection, 1939. Public Domain / Open Access.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","citation":"Katsushika Hokusai, Ejiri in Suruga Province, c. 1830–1832. Color woodblock print on paper. Multiple impressions; see the image record for the reproduced impression. https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","dimensions":"Horizontal ōban print; dimensions vary by impression","collection":"Multiple impressions; see the image record for the reproduced impression","originalImageUrl":"./art-city/artworks/hokusai_ejiri.webp"},{"id":"mishima","title":"Mishima Pass in Kai Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_mishima.webp","alt":"Mishima Pass in Kai Province. Travelers gather beside a large tree.","description":"Travelers gather beside a large tree. The close trunk sets a human scale against the layered landscape beyond.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","citation":"Katsushika Hokusai, Mishima Pass in Kai Province, c. 1830–1832. Color woodblock print on paper. Multiple impressions; see the image record for the reproduced impression. https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","dimensions":"Horizontal ōban print; dimensions vary by impression","collection":"Multiple impressions; see the image record for the reproduced impression","originalImageUrl":"./art-city/artworks/hokusai_mishima.webp"},{"id":"tsukuda","title":"Tsukuda Island in Musashi Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_tsukuda.webp","alt":"Tsukuda Island in Musashi Province. Boats cross a broad plane of water.","description":"Boats cross a broad plane of water. The coast and its small buildings form an interval between the nearby vessels and distant Fuji.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","citation":"Katsushika Hokusai, Tsukuda Island in Musashi Province, c. 1830–1832. Color woodblock print on paper. Multiple impressions; see the image record for the reproduced impression. https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","dimensions":"Horizontal ōban print; dimensions vary by impression","collection":"Multiple impressions; see the image record for the reproduced impression","originalImageUrl":"./art-city/artworks/hokusai_tsukuda.webp"}]},{"id":"rodin","name":"Auguste Rodin","color":"#6c4937","background":"#dedbd4","description":"The body as a complete landscape. Six works. Six points of view.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#rodin","approach":"The sculptural form begins in a material that can be worked directly. A date attached to a sculpture often refers to the conception or modeling of the work.\n\nA mold allows the form to be translated into another material. Scale, surface, and production history matter when identifying a particular object.\n\nA bronze may have been cast years after the original model. Its own date and provenance belong in its record, not beneath a universal date for every version.","works":[{"id":"thinker","title":"The Thinker","date":"Modeled c. 1880; cast c. 1910","medium":"Bronze","imageUrl":"./city-source-assets/art-city/artworks/rodin_thinker.webp","alt":"The Thinker. A compact seated body carries a dense network of tensions: bent back, resting elbow, compressed limbs.","description":"A compact seated body carries a dense network of tensions: bent back, resting elbow, compressed limbs. Thought is made visible as physical effort.","sourceUrl":"https://www.metmuseum.org/art/collection/search/191811","rights":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Thinker_MET_DP-13618-011.jpg","citation":"Auguste Rodin, The Thinker, Modeled c. 1880; cast c. 1910. Bronze. The Metropolitan Museum of Art, 11.173.9. https://www.metmuseum.org/art/collection/search/191811","dimensions":"Height: 70.2 cm","collection":"The Metropolitan Museum of Art, 11.173.9","originalImageUrl":"./art-city/artworks/rodin_thinker.webp"},{"id":"eternal-spring","title":"Eternal Spring","date":"Modeled c. 1881; carved 1907","medium":"Marble","imageUrl":"./city-source-assets/art-city/artworks/rodin_eternal-spring.webp","alt":"Eternal Spring. Two figures make a continuous arrangement of torsos and limbs.","description":"Two figures make a continuous arrangement of torsos and limbs. The work moves between the independent bodies and the single silhouette they create.","sourceUrl":"https://www.metmuseum.org/art/collection/search/193438","rights":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Eternal_Spring_MET_DP-13618-015.jpg","citation":"Auguste Rodin, Eternal Spring, Modeled c. 1881; carved 1907. Marble. The Metropolitan Museum of Art, 17.120.184. https://www.metmuseum.org/art/collection/search/193438","dimensions":"71.1 × 73.7 × 45.7 cm","collection":"The Metropolitan Museum of Art, 17.120.184","originalImageUrl":"./art-city/artworks/rodin_eternal-spring.webp"},{"id":"walking-man","title":"The Walking Man","date":"Model completed before 1900; cast before 1914","medium":"Bronze, green patina","imageUrl":"./city-source-assets/art-city/artworks/rodin_walking-man.webp","alt":"The Walking Man. Without a head or arms, the figure concentrates attention on the spread of the legs and the weight of the torso.","description":"Without a head or arms, the figure concentrates attention on the spread of the legs and the weight of the torso. A step becomes the whole subject.","sourceUrl":"https://www.metmuseum.org/art/collection/search/198565","rights":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Walking_Man_(L%27homme_qui_marche)_MET_131267.jpg","citation":"Auguste Rodin, The Walking Man, Model completed before 1900; cast before 1914. Bronze, green patina. The Metropolitan Museum of Art, 40.12.4. https://www.metmuseum.org/art/collection/search/198565","dimensions":"Height: 85.1 cm","collection":"The Metropolitan Museum of Art, 40.12.4","originalImageUrl":"./art-city/artworks/rodin_walking-man.webp"},{"id":"age-of-bronze","title":"The Age of Bronze","date":"Modeled 1876; cast c. 1906","medium":"Bronze","imageUrl":"./city-source-assets/art-city/artworks/rodin_age-of-bronze.webp","alt":"The Age of Bronze. An upright figure holds its arms in different registers.","description":"An upright figure holds its arms in different registers. Its stance makes the body seem poised between waking, movement, and stillness.","sourceUrl":"https://www.metmuseum.org/art/collection/search/189265","rights":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Age_of_Bronze_(L%27Age_d%27airain)_MET_DP-13618-001.jpg","citation":"Auguste Rodin, The Age of Bronze, Modeled 1876; cast c. 1906. Bronze. The Metropolitan Museum of Art, 07.127. https://www.metmuseum.org/art/collection/search/189265","dimensions":"Height: 182.9 cm","collection":"The Metropolitan Museum of Art, 07.127","originalImageUrl":"./art-city/artworks/rodin_age-of-bronze.webp"},{"id":"madame-x","title":"Madame X","date":"Modeled c. 1907","medium":"Marble","imageUrl":"./city-source-assets/art-city/artworks/rodin_madame-x.webp","alt":"Madame X. A portrait emerges from a broad mass of marble.","description":"A portrait emerges from a broad mass of marble. Look at the change between the polished face and the less resolved stone surrounding it.","sourceUrl":"https://www.metmuseum.org/art/collection/search/191808","rights":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Madame_X_MET_183136.jpg","citation":"Auguste Rodin, Madame X, Modeled c. 1907. Marble. The Metropolitan Museum of Art, 11.173.6. https://www.metmuseum.org/art/collection/search/191808","dimensions":"49.5 × 54.3 × 48.3 cm","collection":"The Metropolitan Museum of Art, 11.173.6","originalImageUrl":"./art-city/artworks/rodin_madame-x.webp"},{"id":"hand-of-god","title":"The Hand of God","date":"Modeled c. 1896–1902; carved c. 1907","medium":"Marble","imageUrl":"./city-source-assets/art-city/artworks/rodin_hand-of-god.webp","alt":"The Hand of God. A large hand holds a small cluster of figures within the stone.","description":"A large hand holds a small cluster of figures within the stone. The work sets the scale of the maker against the scale of what is being formed.","sourceUrl":"https://www.metmuseum.org/art/collection/search/191046","rights":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Hand_of_God_MET_131221.jpg","citation":"Auguste Rodin, The Hand of God, Modeled c. 1896–1902; carved c. 1907. Marble. The Metropolitan Museum of Art, 08.210. https://www.metmuseum.org/art/collection/search/191046","dimensions":"73.7 × 60.3 × 64.1 cm","collection":"The Metropolitan Museum of Art, 08.210","originalImageUrl":"./art-city/artworks/rodin_hand-of-god.webp"}]},{"id":"hilma-af-klint","name":"Hilma af Klint","color":"#664f88","background":"#f2e7df","description":"An atlas of growth, symbols, and shifting scale.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#hilma-af-klint","approach":"Six selected paintings from the ten-part series, arranged here by their original numbers. The omitted numbers are not missing pages: this is a deliberately selected collection.","works":[{"id":"number-2","title":"The Ten Largest, No. 2, Childhood","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-2.webp","alt":"The Ten Largest, No. 2, Childhood. Warm orange forms and delicate lines float against blue.","description":"Warm orange forms and delicate lines float against blue. The painting invites both close inspection of its small signs and a sense of its enormous scale.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 2, Childhood, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-2.webp"},{"id":"number-3","title":"The Ten Largest, No. 3, Youth","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-3.webp","alt":"The Ten Largest, No. 3, Youth. Large loops and organic shapes press against a richly colored field.","description":"Large loops and organic shapes press against a richly colored field. Forms seem to open, join, and multiply.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 3, Youth, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-3.webp"},{"id":"number-4","title":"The Ten Largest, No. 4, Youth","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-4.webp","alt":"The Ten Largest, No. 4, Youth. A dense constellation of curves and symbols unfolds across an orange ground.","description":"A dense constellation of curves and symbols unfolds across an orange ground. The whole composition is larger than a single glance can comfortably hold.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 4, Youth, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-4.webp"},{"id":"number-5","title":"The Ten Largest, No. 5, Adulthood","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-5.webp","alt":"The Ten Largest, No. 5, Adulthood. Spirals, letters, and petal-like forms share the field.","description":"Spirals, letters, and petal-like forms share the field. The organization becomes a language of recurring relationships rather than a fixed key.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 5, Adulthood, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-5.webp"},{"id":"number-7","title":"The Ten Largest, No. 7, Adulthood","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-7.webp","alt":"The Ten Largest, No. 7, Adulthood. Overlapping colored forms establish a patient, expansive rhythm.","description":"Overlapping colored forms establish a patient, expansive rhythm. Small inscriptions suggest a system without offering a complete explanation.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 7, Adulthood, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-7.webp"},{"id":"number-9","title":"The Ten Largest, No. 9, Old Age","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-9.webp","alt":"The Ten Largest, No. 9, Old Age. The composition turns toward pale ground and measured forms.","description":"The composition turns toward pale ground and measured forms. Its quieter intervals remain active: emptiness is part of the structure.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 9, Old Age, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-9.webp"}]},{"id":"mondrian","name":"Piet Mondrian","color":"#b83027","background":"#f1eee4","description":"From a tree’s branching structure to the interval between two planes.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#mondrian","approach":"This is a designer-made proportional exercise, not a reproduction of a Mondrian painting. Move the dividing line. Watch the whole composition change.","works":[{"id":"gray-tree","title":"The Gray Tree","date":"1911","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_gray-tree.webp","alt":"The Gray Tree. Branches spread into a shallow gray field.","description":"Branches spread into a shallow gray field. The tree remains recognizable even as its structure begins to share the logic of the surrounding space.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","citation":"Piet Mondrian, The Gray Tree, 1911. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","dimensions":"Approx. 79 × 109 cm; see record","collection":"Kunstmuseum Den Haag","originalImageUrl":"./art-city/artworks/mondrian_gray-tree.webp"},{"id":"red-tree","title":"Evening (The Red Tree)","date":"1908–1910","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_red-tree.webp","alt":"Evening (The Red Tree). A red trunk and branching limbs hold their shape against blue.","description":"A red trunk and branching limbs hold their shape against blue. The tension between color and observed form is already the main event.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","citation":"Piet Mondrian, Evening (The Red Tree), 1908–1910. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","dimensions":"70 × 99 cm","collection":"Kunstmuseum Den Haag","originalImageUrl":"./art-city/artworks/mondrian_red-tree.webp"},{"id":"apple-tree","title":"Flowering Apple Tree","date":"1912","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_apple-tree.webp","alt":"Flowering Apple Tree. The tree dissolves into arcs and faceted planes.","description":"The tree dissolves into arcs and faceted planes. A pale, restricted palette makes the relation of each line to its neighbors more visible.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","citation":"Piet Mondrian, Flowering Apple Tree, 1912. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","dimensions":"78.5 × 107.5 cm","collection":"Kunstmuseum Den Haag","originalImageUrl":"./art-city/artworks/mondrian_apple-tree.webp"},{"id":"composition-red","title":"Composition with Red, Blue and Yellow","date":"1930","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_composition-red.webp","alt":"Composition with Red, Blue and Yellow. A large red plane dominates the square while small blue and yellow areas adjust its weight.","description":"A large red plane dominates the square while small blue and yellow areas adjust its weight. Unequal divisions produce a deliberate equilibrium.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","citation":"Piet Mondrian, Composition with Red, Blue and Yellow, 1930. Oil on canvas. Kunsthaus Zürich. https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","dimensions":"46 × 46 cm","collection":"Kunsthaus Zürich","originalImageUrl":"./art-city/artworks/mondrian_composition-red.webp"},{"id":"composition-1921","title":"Composition with Large Red Plane, Yellow, Black, Gray and Blue","date":"1921","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_composition-1921.webp","alt":"Composition with Large Red Plane, Yellow, Black, Gray and Blue. A broad red area is held against several narrower divisions.","description":"A broad red area is held against several narrower divisions. The black lines vary in their relationship to the edge rather than functioning as a neutral frame.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","citation":"Piet Mondrian, Composition with Large Red Plane, Yellow, Black, Gray and Blue, 1921. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","dimensions":"59.5 × 59.5 cm","collection":"Kunstmuseum Den Haag","originalImageUrl":"./art-city/artworks/mondrian_composition-1921.webp"},{"id":"composition-1929","title":"Composition No. III, with Red, Blue, Yellow and Black","date":"1929","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_composition-1929.webp","alt":"Composition No. III, with Red, Blue, Yellow and Black. The arrangement makes modest differences of scale consequential.","description":"The arrangement makes modest differences of scale consequential. White surfaces, black boundaries, and color all participate in the balance.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","citation":"Piet Mondrian, Composition No. III, with Red, Blue, Yellow and Black, 1929. Oil on canvas. Private collection; see the historical catalogue record. https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","dimensions":"50 × 50.2 cm","collection":"Private collection; see the historical catalogue record","originalImageUrl":"./art-city/artworks/mondrian_composition-1929.webp"}]},{"id":"lange","name":"Dorothea Lange","color":"#8c3129","background":"#eeeae0","description":"Photographs, captions, and the lives outside the frame.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#lange","approach":"First, describe only what you can see. Resist supplying a story too soon.\n\nNext, read the archival caption: where, when, and by whom was the photograph made? Which names have been recorded, and which have not?\n\nFinally, return to the image. What did the caption clarify? What remains outside the frame?","works":[{"id":"migrant-mother","title":"Migrant Mother, Nipomo, California","date":"1936","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_migrant-mother.webp","alt":"Migrant Mother, Nipomo, California. Florence Owens Thompson sits with children leaning against her.","description":"Florence Owens Thompson sits with children leaning against her. Their turned faces and her distant gaze give the compact group a strongly directional structure.","sourceUrl":"https://www.loc.gov/pictures/item/2017762891/","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg","citation":"Dorothea Lange, Migrant Mother, Nipomo, California, 1936. Black-and-white photograph. Library of Congress; digitized archival photograph. https://www.loc.gov/pictures/item/2017762891/","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","originalImageUrl":"./art-city/artworks/lange_migrant-mother.webp"},{"id":"toward-la","title":"Toward Los Angeles, California","date":"1937","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_toward-la.webp","alt":"Toward Los Angeles, California. Two men walk along a road beneath a billboard advertising a different kind of travel.","description":"Two men walk along a road beneath a billboard advertising a different kind of travel. The photograph holds their journey and the commercial promise in the same frame.","sourceUrl":"https://www.loc.gov/item/2017769825/","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Toward_Los_Angeles%2C_California_LOC_3549663710.jpg","citation":"Dorothea Lange, Toward Los Angeles, California, 1937. Black-and-white photograph. Library of Congress; digitized archival photograph. https://www.loc.gov/item/2017769825/","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","originalImageUrl":"./art-city/artworks/lange_toward-la.webp"},{"id":"children-camp","title":"Children of an Oklahoma Drought Refugee, California","date":"1936","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_children-camp.webp","alt":"Children of an Oklahoma Drought Refugee, California. Children appear within the setting of a migratory camp.","description":"Children appear within the setting of a migratory camp. The archive identifies the family through their displacement from Oklahoma; the photograph also asks for attention to each person in the frame.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","citation":"Dorothea Lange, Children of an Oklahoma Drought Refugee, California, 1936. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","originalImageUrl":"./art-city/artworks/lange_children-camp.webp"},{"id":"dust-storm","title":"Dust Storm near Mills, New Mexico","date":"1935","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_dust-storm.webp","alt":"Dust Storm near Mills, New Mexico. The view records a dust storm near Mills.","description":"The view records a dust storm near Mills. Read the scene as both a landscape and evidence of conditions that shaped the lives of people working the land.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","citation":"Dorothea Lange, Dust Storm near Mills, New Mexico, 1935. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","originalImageUrl":"./art-city/artworks/lange_dust-storm.webp"},{"id":"pea-pickers-children","title":"Pea Pickers’ Children, Nipomo, California","date":"1935","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_pea-pickers-children.webp","alt":"Pea Pickers’ Children, Nipomo, California. A photograph of children in a pea-picking community.","description":"A photograph of children in a pea-picking community. The short archival caption places the scene within agricultural labor without supplying a complete account of the children’s lives.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","citation":"Dorothea Lange, Pea Pickers’ Children, Nipomo, California, 1935. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","originalImageUrl":"./art-city/artworks/lange_pea-pickers-children.webp"},{"id":"roadside-blythe","title":"Drought Refugees from Oklahoma, near Blythe","date":"1936","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_roadside-blythe.webp","alt":"Drought Refugees from Oklahoma, near Blythe. The photograph records a roadside camp near Blythe.","description":"The photograph records a roadside camp near Blythe. Its title connects this temporary stopping place to a journey from Oklahoma.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","citation":"Dorothea Lange, Drought Refugees from Oklahoma, near Blythe, 1936. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","originalImageUrl":"./art-city/artworks/lange_roadside-blythe.webp"}]},{"id":"morris","name":"William Morris","color":"#8d482d","background":"#eee4cb","description":"Leaves, stems, and the pleasure of repetition.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#morris","approach":"Compare a surface at different scales. This viewer repeats the supplied photograph; it is a viewing experiment, not a production-ready or necessarily seamless textile tile.","works":[{"id":"strawberry-thief","title":"Strawberry Thief","date":"1883","medium":"Printed cotton","imageUrl":"./city-source-assets/art-city/artworks/morris_strawberry-thief.webp","alt":"Strawberry Thief. Birds, fruit, and curling stems are held in a dense repeat.","description":"Birds, fruit, and curling stems are held in a dense repeat. Dark ground and small pale flowers let the pattern remain readable at several distances.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","citation":"William Morris, Strawberry Thief, 1883. Printed cotton. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","originalImageUrl":"./art-city/artworks/morris_strawberry-thief.webp"},{"id":"snakeshead","title":"Snakeshead","date":"1876","medium":"Printed cotton","imageUrl":"./city-source-assets/art-city/artworks/morris_snakeshead.webp","alt":"Snakeshead. Drooping flower heads sit within a framework of stems and foliage.","description":"Drooping flower heads sit within a framework of stems and foliage. Small changes of direction animate an otherwise measured repeat.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","citation":"William Morris, Snakeshead, 1876. Printed cotton. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","originalImageUrl":"./art-city/artworks/morris_snakeshead.webp"},{"id":"willow-boughs","title":"Willow Boughs","date":"1887","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_willow-boughs.webp","alt":"Willow Boughs. Slender leaves overlap along curling branches.","description":"Slender leaves overlap along curling branches. The design is dense but not closed: pale spaces continue to circulate between the stems.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","citation":"William Morris, Willow Boughs, 1887. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","originalImageUrl":"./art-city/artworks/morris_willow-boughs.webp"},{"id":"trellis","title":"Trellis","date":"Designed 1862","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_trellis.webp","alt":"Trellis. Birds and climbing flowers cross a measured lattice.","description":"Birds and climbing flowers cross a measured lattice. Designed by William Morris, with the birds drawn by Philip Webb, the pattern brings the garden against a geometric framework.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","rights":"Design: William Morris, with birds by Philip Webb. Reproduction: The Metropolitan Museum of Art, Open Access (CC0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","citation":"William Morris, Trellis, Designed 1862. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","originalImageUrl":"./art-city/artworks/morris_trellis.webp"},{"id":"daisy","title":"Daisy","date":"1864","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_daisy.webp","alt":"Daisy. Small flowers rise from evenly spaced tufts of foliage.","description":"Small flowers rise from evenly spaced tufts of foliage. The ground remains visible, giving the repeat a lighter, more open rhythm.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","citation":"William Morris, Daisy, 1864. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","originalImageUrl":"./art-city/artworks/morris_daisy.webp"},{"id":"acanthus","title":"Acanthus","date":"1875","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_acanthus.webp","alt":"Acanthus. Broad, curling leaves build a close, layered surface.","description":"Broad, curling leaves build a close, layered surface. The repeat depends on their shared movement rather than a conspicuous geometric frame.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","citation":"William Morris, Acanthus, 1875. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","originalImageUrl":"./art-city/artworks/morris_acanthus.webp"}]},{"id":"klee","name":"Paul Klee","color":"#9d3e2f","background":"#f2ead9","description":"Small worlds. Unexpected neighbors. A notebook left open.","websiteUrl":"https://hadi1373z.github.io/artist-galleries/#klee","approach":"The works do not change, but their neighbors do. Rearrange this editorial notebook and compare the new relationships. The original collection order can always be restored.","works":[{"id":"senecio","title":"Senecio","date":"1922","medium":"Oil on gauze, mounted on cardboard","imageUrl":"./city-source-assets/art-city/artworks/klee_senecio.webp","alt":"Senecio. A face is assembled from broad planes and small irregularities.","description":"A face is assembled from broad planes and small irregularities. The eyes never quite settle into symmetry, keeping the figure alert and strange.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","citation":"Paul Klee, Senecio, 1922. Oil on gauze, mounted on cardboard. Kunstmuseum Basel. https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","dimensions":"40.3 × 37.4 cm","collection":"Kunstmuseum Basel","originalImageUrl":"./art-city/artworks/klee_senecio.webp"},{"id":"twittering-machine","title":"Twittering Machine","date":"1922","medium":"Oil transfer and watercolor on paper","imageUrl":"./city-source-assets/art-city/artworks/klee_twittering-machine.webp","alt":"Twittering Machine. Bird-like forms perch on a drawn mechanism.","description":"Bird-like forms perch on a drawn mechanism. The thin line can be read as anatomy, notation, or apparatus without choosing only one.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","citation":"Paul Klee, Twittering Machine, 1922. Oil transfer and watercolor on paper. The Museum of Modern Art. https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","dimensions":"63.8 × 48.1 cm","collection":"The Museum of Modern Art","originalImageUrl":"./art-city/artworks/klee_twittering-machine.webp"},{"id":"red-balloon","title":"Red Balloon","date":"1922","medium":"Oil on chalk-primed gauze mounted on board","imageUrl":"./city-source-assets/art-city/artworks/klee_red-balloon.webp","alt":"Red Balloon. A red circle floats above a compact arrangement of architectural shapes.","description":"A red circle floats above a compact arrangement of architectural shapes. The lightest-looking form becomes the strongest point of attention.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","citation":"Paul Klee, Red Balloon, 1922. Oil on chalk-primed gauze mounted on board. Solomon R. Guggenheim Museum. https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","dimensions":"31.8 × 31.1 cm","collection":"Solomon R. Guggenheim Museum","originalImageUrl":"./art-city/artworks/klee_red-balloon.webp"},{"id":"fish-magic","title":"Fish Magic","date":"1925","medium":"Oil and watercolor on canvas on panel","imageUrl":"./city-source-assets/art-city/artworks/klee_fish-magic.webp","alt":"Fish Magic. Fish, flowers, and signs emerge from a dark field.","description":"Fish, flowers, and signs emerge from a dark field. The composition feels suspended between an underwater scene and a small theater of appearances.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","citation":"Paul Klee, Fish Magic, 1925. Oil and watercolor on canvas on panel. Philadelphia Museum of Art. https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","dimensions":"77.2 × 98.4 cm","collection":"Philadelphia Museum of Art","originalImageUrl":"./art-city/artworks/klee_fish-magic.webp"},{"id":"castle-and-sun","title":"Castle and Sun","date":"1928","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/klee_castle-and-sun.webp","alt":"Castle and Sun. A town is built from warm rectangles, triangles, and a single bright circle.","description":"A town is built from warm rectangles, triangles, and a single bright circle. Color, not perspective, gives the structures their depth.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","citation":"Paul Klee, Castle and Sun, 1928. Oil on canvas. See source record. https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","dimensions":"50 × 59 cm","collection":"See source record","originalImageUrl":"./art-city/artworks/klee_castle-and-sun.webp"},{"id":"ancient-sound","title":"Ancient Sound","date":"1925","medium":"Oil on cardboard","imageUrl":"./city-source-assets/art-city/artworks/klee_ancient-sound.webp","alt":"Ancient Sound. A field of small colored squares expands from a darker center.","description":"A field of small colored squares expands from a darker center. The measured grid creates a setting for gradual changes of tone.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","citation":"Paul Klee, Ancient Sound, 1925. Oil on cardboard. Kunstmuseum Basel. https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","dimensions":"38.1 × 38.2 cm","collection":"Kunstmuseum Basel","originalImageUrl":"./art-city/artworks/klee_ancient-sound.webp"}]}];
const STORE_OBJECTS=[{"id":"model-lantern","model":"Lantern","title":"Wooden lantern","category":"Lighting","creator":"Microsoft / sbtron","description":"Observe light and shadow. This model is a study object, not a working room light.","assetId":"a79458c4b02d695187a952f23a63b8bf278e7bc3d316a3c2a314f2d6974181f1","bytes":9564264,"license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","sourceUrl":"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/Lantern","sourceRecord":"./city-source-assets/object-store/sources/Lantern.txt","downloadUrl":"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/Lantern/glTF-Binary/Lantern.glb","revision":"edc7c9e67c639d230715049ee31f9a96a6babbbe","modifications":"Original GLB bytes retained. The game scales the model for display.","type":"model","scale":1.1,"action":"reflect","assetPath":"./city-source-assets/object-store/assets/a79458c4b02d695187a952f23a63b8bf278e7bc3d316a3c2a314f2d6974181f1.glb","verifiedSha256":"a79458c4b02d695187a952f23a63b8bf278e7bc3d316a3c2a314f2d6974181f1","originalSourceRecord":"./object-store/sources/Lantern.txt"},{"id":"model-avocado","model":"Avocado","title":"Avocado study","category":"Nature","creator":"Microsoft","description":"Describe its visible structure, then distinguish observation from inference.","assetId":"ccc9c3ce56423720b09399c2351537207cd5a65f859f9e6e2f30922762f3abd4","bytes":8110040,"license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","sourceUrl":"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/Avocado","sourceRecord":"./city-source-assets/object-store/sources/Avocado.txt","downloadUrl":"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/Avocado/glTF-Binary/Avocado.glb","revision":"edc7c9e67c639d230715049ee31f9a96a6babbbe","modifications":"Original GLB bytes retained. The game scales the model for display.","type":"model","scale":0.7,"action":"reflect","assetPath":"./city-source-assets/object-store/assets/ccc9c3ce56423720b09399c2351537207cd5a65f859f9e6e2f30922762f3abd4.glb","verifiedSha256":"ccc9c3ce56423720b09399c2351537207cd5a65f859f9e6e2f30922762f3abd4","originalSourceRecord":"./object-store/sources/Avocado.txt"},{"id":"model-boombox","model":"BoomBox","title":"Portable radio","category":"Technology","creator":"Microsoft","description":"Explore the relationship between shape, controls and a familiar function. This study model does not play audio.","assetId":"f8b918445ebdd006768232205a62f5182d2208ca57f84c6ccc084943c0bc8f15","bytes":10614184,"license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","sourceUrl":"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/BoomBox","sourceRecord":"./city-source-assets/object-store/sources/BoomBox.txt","downloadUrl":"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/BoomBox/glTF-Binary/BoomBox.glb","revision":"edc7c9e67c639d230715049ee31f9a96a6babbbe","modifications":"Original GLB bytes retained. The game scales the model for display.","type":"model","scale":0.7,"action":"reflect","assetPath":"./city-source-assets/object-store/assets/f8b918445ebdd006768232205a62f5182d2208ca57f84c6ccc084943c0bc8f15.glb","verifiedSha256":"f8b918445ebdd006768232205a62f5182d2208ca57f84c6ccc084943c0bc8f15","originalSourceRecord":"./object-store/sources/BoomBox.txt"},{"id":"model-waterbottle","model":"WaterBottle","title":"Water bottle","category":"Everyday objects","creator":"Microsoft","description":"Compare usefulness, material and shape. Record a design that would improve everyday use.","assetId":"b337e526fd6a162013c2984aeec163f5fbb4f717252724dfc3f3458bd51df94b","bytes":8966700,"license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","sourceUrl":"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/WaterBottle","sourceRecord":"./city-source-assets/object-store/sources/WaterBottle.txt","downloadUrl":"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/WaterBottle/glTF-Binary/WaterBottle.glb","revision":"edc7c9e67c639d230715049ee31f9a96a6babbbe","modifications":"Original GLB bytes retained. The game scales the model for display.","type":"model","scale":0.7,"action":"reflect","assetPath":"./city-source-assets/object-store/assets/b337e526fd6a162013c2984aeec163f5fbb4f717252724dfc3f3458bd51df94b.glb","verifiedSha256":"b337e526fd6a162013c2984aeec163f5fbb4f717252724dfc3f3458bd51df94b","originalSourceRecord":"./object-store/sources/WaterBottle.txt"},{"id":"model-sheenchair","model":"SheenChair","title":"Velvet reading chair","category":"Furniture","creator":"Wayfair, LLC / Eric Chadwick","description":"Study the chair’s proportions and material. This is a static exhibit, without a sitting action.","assetId":"f0af2a2b102d28d540236306ae19f8fb36842df76bd38cf76f063f9bd2853399","bytes":4125648,"license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","sourceUrl":"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/SheenChair","sourceRecord":"./city-source-assets/object-store/sources/SheenChair.txt","downloadUrl":"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/SheenChair/glTF-Binary/SheenChair.glb","revision":"edc7c9e67c639d230715049ee31f9a96a6babbbe","modifications":"Original GLB bytes retained. The game scales the model for display.","type":"model","scale":1.3,"action":"reflect","assetPath":"./city-source-assets/object-store/assets/f0af2a2b102d28d540236306ae19f8fb36842df76bd38cf76f063f9bd2853399.glb","verifiedSha256":"f0af2a2b102d28d540236306ae19f8fb36842df76bd38cf76f063f9bd2853399","originalSourceRecord":"./object-store/sources/SheenChair.txt"},{"id":"model-toycar","model":"ToyCar","title":"Toy car","category":"Play","creator":"Guido Odendahl / Eric Chadwick","description":"Explore scale and movement through a static model; write a prediction for a real experiment.","assetId":"01a60862de55cd4b9f3acfab0b0def86451800f9c42467fcd61052c16cb9838c","bytes":5422412,"license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","sourceUrl":"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/ToyCar","sourceRecord":"./city-source-assets/object-store/sources/ToyCar.txt","downloadUrl":"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/ToyCar/glTF-Binary/ToyCar.glb","revision":"edc7c9e67c639d230715049ee31f9a96a6babbbe","modifications":"Original GLB bytes retained. The game scales the model for display.","type":"model","scale":0.7,"action":"reflect","assetPath":"./city-source-assets/object-store/assets/01a60862de55cd4b9f3acfab0b0def86451800f9c42467fcd61052c16cb9838c.glb","verifiedSha256":"01a60862de55cd4b9f3acfab0b0def86451800f9c42467fcd61052c16cb9838c","originalSourceRecord":"./object-store/sources/ToyCar.txt"},{"id":"stock-reading-chair","title":"Reading chair","category":"Home furniture","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/d7498a1c6fee2e3f602ab1107b79a4cf1f24753c/web/residence-interior-v1.js","sourceRecord":"./city-source-assets/object-store/sources/reading-chair.txt","sourceType":"project","revision":"d7498a1c6fee2e3f602ab1107b79a4cf1f24753c","assetId":"12f76c0f4e055168d3e58a6575712fd18b9f4ee4cac331dce728ec091d694646","bytes":17944,"scale":1.1,"description":"A reusable static model from the existing house. Add your own idea or learning activity; this copy does not inherit sitting, resting or resident interactions.","modifications":"Mesh shapes copied from the retained game renderer; textures simplified to material colours and exported as a static GLB.","type":"model","action":"reflect","assetPath":"./city-source-assets/object-store/assets/12f76c0f4e055168d3e58a6575712fd18b9f4ee4cac331dce728ec091d694646.glb","verifiedSha256":"12f76c0f4e055168d3e58a6575712fd18b9f4ee4cac331dce728ec091d694646","originalSourceRecord":"./object-store/sources/reading-chair.txt"},{"id":"stock-bed","title":"Bedroom bed","category":"Home furniture","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/d7498a1c6fee2e3f602ab1107b79a4cf1f24753c/web/residence-interior-v1.js","sourceRecord":"./city-source-assets/object-store/sources/bed.txt","sourceType":"project","revision":"d7498a1c6fee2e3f602ab1107b79a4cf1f24753c","assetId":"9ece0627957feba210e276f5e68ed1a8b891c225bf9e72aed7ebd06f9b35a6b9","bytes":87040,"scale":1.3,"description":"A reusable static model from the existing house. Add your own idea or learning activity; this copy does not inherit sitting, resting or resident interactions.","modifications":"Mesh shapes copied from the retained game renderer; textures simplified to material colours and exported as a static GLB.","type":"model","action":"reflect","assetPath":"./city-source-assets/object-store/assets/9ece0627957feba210e276f5e68ed1a8b891c225bf9e72aed7ebd06f9b35a6b9.glb","verifiedSha256":"9ece0627957feba210e276f5e68ed1a8b891c225bf9e72aed7ebd06f9b35a6b9","originalSourceRecord":"./object-store/sources/bed.txt"},{"id":"stock-sofa","title":"Living-room sofa","category":"Home furniture","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/d7498a1c6fee2e3f602ab1107b79a4cf1f24753c/web/residence-interior-v1.js","sourceRecord":"./city-source-assets/object-store/sources/sofa.txt","sourceType":"project","revision":"d7498a1c6fee2e3f602ab1107b79a4cf1f24753c","assetId":"a3eb8795b05139e59bf4f92a8438055bf257d56ded483682b16a7076d48c4e25","bytes":84064,"scale":1.4,"description":"A reusable static model from the existing house. Add your own idea or learning activity; this copy does not inherit sitting, resting or resident interactions.","modifications":"Mesh shapes copied from the retained game renderer; textures simplified to material colours and exported as a static GLB.","type":"model","action":"reflect","assetPath":"./city-source-assets/object-store/assets/a3eb8795b05139e59bf4f92a8438055bf257d56ded483682b16a7076d48c4e25.glb","verifiedSha256":"a3eb8795b05139e59bf4f92a8438055bf257d56ded483682b16a7076d48c4e25","originalSourceRecord":"./object-store/sources/sofa.txt"},{"id":"stock-dream-chair","title":"Long-legged dream chair","category":"Surreal objects","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/d7498a1c6fee2e3f602ab1107b79a4cf1f24753c/web/dali-house-scene.js","sourceRecord":"./city-source-assets/object-store/sources/dream-chair.txt","sourceType":"project","revision":"d7498a1c6fee2e3f602ab1107b79a4cf1f24753c","assetId":"ef2e5384267677d5270322099f22eb458af780a82128ec67ead996d213fc1319","bytes":36508,"scale":1.5,"description":"A reusable static model from the existing house. Add your own idea or learning activity; this copy does not inherit sitting, resting or resident interactions.","modifications":"Mesh shapes copied from the retained game renderer; textures simplified to material colours and exported as a static GLB.","type":"model","action":"reflect","assetPath":"./city-source-assets/object-store/assets/ef2e5384267677d5270322099f22eb458af780a82128ec67ead996d213fc1319.glb","verifiedSha256":"ef2e5384267677d5270322099f22eb458af780a82128ec67ead996d213fc1319","originalSourceRecord":"./object-store/sources/dream-chair.txt"},{"id":"stock-dream-cabinet","title":"Cabinet of questions","category":"Surreal objects","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/d7498a1c6fee2e3f602ab1107b79a4cf1f24753c/web/dali-house-scene.js","sourceRecord":"./city-source-assets/object-store/sources/dream-cabinet.txt","sourceType":"project","revision":"d7498a1c6fee2e3f602ab1107b79a4cf1f24753c","assetId":"c31b85f68da7c5ac9bb511d881896e32a2e766de230b3a69e2f69b09154aabf6","bytes":248716,"scale":1.2,"description":"A reusable static model from the existing house. Add your own idea or learning activity; this copy does not inherit sitting, resting or resident interactions.","modifications":"Mesh shapes copied from the retained game renderer; textures simplified to material colours and exported as a static GLB.","type":"model","action":"reflect","assetPath":"./city-source-assets/object-store/assets/c31b85f68da7c5ac9bb511d881896e32a2e766de230b3a69e2f69b09154aabf6.glb","verifiedSha256":"c31b85f68da7c5ac9bb511d881896e32a2e766de230b3a69e2f69b09154aabf6","originalSourceRecord":"./object-store/sources/dream-cabinet.txt"},{"id":"stock-dream-spheres","title":"Floating sphere study","category":"Surreal objects","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/d7498a1c6fee2e3f602ab1107b79a4cf1f24753c/web/dali-house-scene.js","sourceRecord":"./city-source-assets/object-store/sources/dream-spheres.txt","sourceType":"project","revision":"d7498a1c6fee2e3f602ab1107b79a4cf1f24753c","assetId":"9f99da064b9f2b9255ac42481505242840a73a2f3b984e3cc76ec68a1a65fcaa","bytes":233948,"scale":1.1,"description":"A reusable static model from the existing house. Add your own idea or learning activity; this copy does not inherit sitting, resting or resident interactions.","modifications":"Mesh shapes copied from the retained game renderer; textures simplified to material colours and exported as a static GLB.","type":"model","action":"reflect","assetPath":"./city-source-assets/object-store/assets/9f99da064b9f2b9255ac42481505242840a73a2f3b984e3cc76ec68a1a65fcaa.glb","verifiedSha256":"9f99da064b9f2b9255ac42481505242840a73a2f3b984e3cc76ec68a1a65fcaa","originalSourceRecord":"./object-store/sources/dream-spheres.txt"},{"id":"artifact-assumption-balance","title":"Balance of assumptions","action":"question","scale":1.3,"description":"A balance holds a smooth claim and an angular counterexample. Activity: name one belief, give evidence for it, then offer a case that could overturn it. What would make the two sides fair?","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/assumption-balance.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"c06c81e7a7f346bd52acd991ef7bdb8e777c7ea8e5e8c2c5db5e40800449c31b","bytes":92732,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/c06c81e7a7f346bd52acd991ef7bdb8e777c7ea8e5e8c2c5db5e40800449c31b.glb","verifiedSha256":"c06c81e7a7f346bd52acd991ef7bdb8e777c7ea8e5e8c2c5db5e40800449c31b","originalSourceRecord":"./object-store/sources/assumption-balance.txt"},{"id":"artifact-idea-constellation","title":"Constellation of ideas","action":"experiment","scale":1.4,"description":"Different coloured ideas remain connected across an open frame. Activity: name four ideas and label their connections supports, contradicts, depends on or illustrates. Which connection needs evidence?","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/idea-constellation.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"673be6b2e55171872ed2841a90236ed57ea90de76ae4c162ba0af52e79e5c546","bytes":157212,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/673be6b2e55171872ed2841a90236ed57ea90de76ae4c162ba0af52e79e5c546.glb","verifiedSha256":"673be6b2e55171872ed2841a90236ed57ea90de76ae4c162ba0af52e79e5c546","originalSourceRecord":"./object-store/sources/idea-constellation.txt"},{"id":"artifact-memory-cabinet","title":"Cabinet of earlier selves","action":"reflect","scale":1.5,"description":"An open cabinet keeps several small house editions side by side. Activity: describe what an earlier home taught you. What should the next edition preserve, and what should it challenge?","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/memory-cabinet.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"24f8346a20d35d96b033f000a7a1805d9b31846582a734b474ad6bbacec83e49","bytes":81972,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/24f8346a20d35d96b033f000a7a1805d9b31846582a734b474ad6bbacec83e49.glb","verifiedSha256":"24f8346a20d35d96b033f000a7a1805d9b31846582a734b474ad6bbacec83e49","originalSourceRecord":"./object-store/sources/memory-cabinet.txt"},{"id":"artifact-uncertainty-lantern","title":"Lantern of uncertainty","action":"question","scale":1.2,"description":"An open cage surrounds an unresolved blue thought. Activity: separate what you know, what you infer and what you cannot yet decide. Name one observation that would reduce uncertainty. This sculpture does not change room lighting.","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/uncertainty-lantern.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"dfeae78875a4ad8378904e35aecc799ebdf4d96c6aa25e4f31eecb4f35aa26d9","bytes":123824,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/dfeae78875a4ad8378904e35aecc799ebdf4d96c6aa25e4f31eecb4f35aa26d9.glb","verifiedSha256":"dfeae78875a4ad8378904e35aecc799ebdf4d96c6aa25e4f31eecb4f35aa26d9","originalSourceRecord":"./object-store/sources/uncertainty-lantern.txt"},{"id":"artifact-forked-path","title":"Garden of possible paths","action":"experiment","scale":1.4,"description":"A miniature path branches toward contrasting destinations. Activity: choose two possible house improvements, predict their effects, and choose one small reversible experiment before committing to either.","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/forked-path.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"6554f81b0166ba207096d08981bcd02505fb0a0449856793a7ce75ed787c5d42","bytes":61556,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/6554f81b0166ba207096d08981bcd02505fb0a0449856793a7ce75ed787c5d42.glb","verifiedSha256":"6554f81b0166ba207096d08981bcd02505fb0a0449856793a7ce75ed787c5d42","originalSourceRecord":"./object-store/sources/forked-path.txt"},{"id":"artifact-perspective-window","title":"Window of other perspectives","action":"question","scale":1.4,"description":"Rotated frames reveal the same sphere through different openings. Activity: interpret one painting from two viewpoints. Which visible detail supports each reading? These frames are a sculpture, not a portal.","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/perspective-window.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"1d19c3d21d09deb094feecc140cb803a3c116a9b99cd67dcc030af69d9faf464","bytes":40812,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/1d19c3d21d09deb094feecc140cb803a3c116a9b99cd67dcc030af69d9faf464.glb","verifiedSha256":"1d19c3d21d09deb094feecc140cb803a3c116a9b99cd67dcc030af69d9faf464","originalSourceRecord":"./object-store/sources/perspective-window.txt"},{"id":"artifact-reflection-well","title":"Well of reflection","action":"reflect","scale":1.2,"description":"Concentric steps lead to a quiet blue centre. Activity: before exploring, write what you expect to learn. Afterwards, name what changed and one question still open. The blue surface is symbolic, not a live mirror.","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/reflection-well.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"d79d5c03f675bdd4eefd259e45e3b06abd3f6bd100dd7187dea858e383f3f03d","bytes":113912,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/d79d5c03f675bdd4eefd259e45e3b06abd3f6bd100dd7187dea858e383f3f03d.glb","verifiedSha256":"d79d5c03f675bdd4eefd259e45e3b06abd3f6bd100dd7187dea858e383f3f03d","originalSourceRecord":"./object-store/sources/reflection-well.txt"},{"id":"artifact-dialogue-table","title":"Table for an unfinished dialogue","action":"question","scale":1.5,"description":"Two seats face an open ring with space for a third view. Activity: write a claim in your own words, give the fairest opposing argument, then revise the claim. The seats are part of a static sculpture.","category":"Thinking artifacts","creator":"House of Ideas project","license":"Project-created model; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-artifacts.js","sourceRecord":"./city-source-assets/object-store/sources/dialogue-table.txt","sourceType":"project","revision":"Idea artifacts v1","assetId":"6d60c902bf8d8455c066d8e4036324e113e9f6bdcc7e6b7b8c4c49a56c6f189d","bytes":84992,"modifications":"Original procedural geometry created for House of Ideas. Static sculpture with an explicit learning activity; no external model or texture used.","type":"model","assetPath":"./city-source-assets/object-store/assets/6d60c902bf8d8455c066d8e4036324e113e9f6bdcc7e6b7b8c4c49a56c6f189d.glb","verifiedSha256":"6d60c902bf8d8455c066d8e4036324e113e9f6bdcc7e6b7b8c4c49a56c6f189d","originalSourceRecord":"./object-store/sources/dialogue-table.txt"},{"id":"music-dialogues-at-dawn","title":"Dialogues at dawn","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-dialogues-at-dawn.txt","sourceType":"project","revision":"Listening garden v1","assetId":"7d342bd5e0f4b2d19dfa42566d73ada2df4c04be98485fd990ee18c831d66323","bytes":88596,"scale":1.6,"action":"reflect","audioSha256":"0c83f36563b28800b51f39276f4edc76591cbfe3d5b9f0879d30b59257023fdf","audioBytes":1050426,"duration":23.818181818181817,"description":"An original 24-second instrumental miniature with a physical musical poster. Listen for the phrase that returns. What changes when it returns?","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/7d342bd5e0f4b2d19dfa42566d73ada2df4c04be98485fd990ee18c831d66323.glb","verifiedSha256":"7d342bd5e0f4b2d19dfa42566d73ada2df4c04be98485fd990ee18c831d66323","originalSourceRecord":"./object-store/sources/music-dialogues-at-dawn.txt","originalAudioUrl":"./object-store/audio/dialogues-at-dawn.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/dialogues-at-dawn.wav"},{"id":"music-counterexample-waltz","title":"Counterexample waltz","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-counterexample-waltz.txt","sourceType":"project","revision":"Listening garden v1","assetId":"a7f2897ce0598f7a6aee3074fa446ddd03868e351e630abaf23eb7beaeb7781e","bytes":88600,"scale":1.6,"action":"reflect","audioSha256":"2e75f3d41a82d20fe109be9e28265d5767ca72b2b7e49988293faeecba8b3588","audioBytes":970244,"duration":22,"description":"An original 22-second instrumental miniature with a physical musical poster. Where does the melody resist your expectation? Describe the counterexample.","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/a7f2897ce0598f7a6aee3074fa446ddd03868e351e630abaf23eb7beaeb7781e.glb","verifiedSha256":"a7f2897ce0598f7a6aee3074fa446ddd03868e351e630abaf23eb7beaeb7781e","originalSourceRecord":"./object-store/sources/music-counterexample-waltz.txt","originalAudioUrl":"./object-store/audio/counterexample-waltz.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/counterexample-waltz.wav"},{"id":"music-memory-rooms","title":"Memory rooms","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-memory-rooms.txt","sourceType":"project","revision":"Listening garden v1","assetId":"1ef30e90fd045e370d30de4d232fa995f1ba67ca7ed4d401784a07f7c58791c1","bytes":88596,"scale":1.6,"action":"reflect","audioSha256":"7c8a4c9927637aab68e3c2e19944dbf06a6720b9121ca65bd479e2032f440988","audioBytes":1202350,"duration":27.263157894736842,"description":"An original 27-second instrumental miniature with a physical musical poster. Name a room or memory this piece suggests and explain which sound prompted it.","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/1ef30e90fd045e370d30de4d232fa995f1ba67ca7ed4d401784a07f7c58791c1.glb","verifiedSha256":"1ef30e90fd045e370d30de4d232fa995f1ba67ca7ed4d401784a07f7c58791c1","originalSourceRecord":"./object-store/sources/music-memory-rooms.txt","originalAudioUrl":"./object-store/audio/memory-rooms.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/memory-rooms.wav"},{"id":"music-constellation-walk","title":"Constellation walk","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-constellation-walk.txt","sourceType":"project","revision":"Listening garden v1","assetId":"b2f94b37b6bda4f939337581cdc4c7a10c1e2f120d8eb917e6dcbdb796cef512","bytes":88596,"scale":1.6,"action":"reflect","audioSha256":"9ad358586cd9f2eba2e2ddd7c538cb59e9fcddd72f1f8b4696decb6018833efa","audioBytes":934964,"duration":21.2,"description":"An original 21-second instrumental miniature with a physical musical poster. Imagine each note as an idea. Which musical relationships resemble connections between ideas?","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/b2f94b37b6bda4f939337581cdc4c7a10c1e2f120d8eb917e6dcbdb796cef512.glb","verifiedSha256":"b2f94b37b6bda4f939337581cdc4c7a10c1e2f120d8eb917e6dcbdb796cef512","originalSourceRecord":"./object-store/sources/music-constellation-walk.txt","originalAudioUrl":"./object-store/audio/constellation-walk.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/constellation-walk.wav"},{"id":"music-uncertainty-blue","title":"Uncertainty blue","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-uncertainty-blue.txt","sourceType":"project","revision":"Listening garden v1","assetId":"ecb8e47c97bf4510a86c2d15a877ca949fb666918ed81f3852c9289e1a9e473d","bytes":88600,"scale":1.6,"action":"reflect","audioSha256":"48ba8bac1d155f75e8fdc587039e4833ed663fa633fa0c13a5bdbf98f1349c44","audioBytes":1146644,"duration":26,"description":"An original 26-second instrumental miniature with a physical musical poster. Separate a feeling produced by the music from a claim about the music itself.","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/ecb8e47c97bf4510a86c2d15a877ca949fb666918ed81f3852c9289e1a9e473d.glb","verifiedSha256":"ecb8e47c97bf4510a86c2d15a877ca949fb666918ed81f3852c9289e1a9e473d","originalSourceRecord":"./object-store/sources/music-uncertainty-blue.txt","originalAudioUrl":"./object-store/audio/uncertainty-blue.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/uncertainty-blue.wav"},{"id":"music-garden-of-branches","title":"Garden of branches","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-garden-of-branches.txt","sourceType":"project","revision":"Listening garden v1","assetId":"2b0e8a78defb2e875026a4a2ebc72facc13768b3842a3b62912728c1f8882fa7","bytes":88592,"scale":1.6,"action":"reflect","audioSha256":"0a2a34741ba19b8be62e32828c94527054db674cb8907a5d7af43a60fe2f782a","audioBytes":1008592,"duration":22.869565217391305,"description":"An original 23-second instrumental miniature with a physical musical poster. Predict the next phrase before it arrives. Compare the prediction with what you hear.","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/2b0e8a78defb2e875026a4a2ebc72facc13768b3842a3b62912728c1f8882fa7.glb","verifiedSha256":"2b0e8a78defb2e875026a4a2ebc72facc13768b3842a3b62912728c1f8882fa7","originalSourceRecord":"./object-store/sources/music-garden-of-branches.txt","originalAudioUrl":"./object-store/audio/garden-of-branches.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/garden-of-branches.wav"},{"id":"music-perspective-windows","title":"Perspective windows","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-perspective-windows.txt","sourceType":"project","revision":"Listening garden v1","assetId":"9c9ba21fd343f28fb2a1c4830a1395555ff33fe59a4c418350249026105ad04b","bytes":88596,"scale":1.6,"action":"reflect","audioSha256":"f215f957d1cfaffa87977b090e1e2b8596907006ff8a5c919cee7aee0c7c274a","audioBytes":1096244,"duration":24.857142857142858,"description":"An original 25-second instrumental miniature with a physical musical poster. Listen once for the melody and once for the bass. How does your interpretation change?","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/9c9ba21fd343f28fb2a1c4830a1395555ff33fe59a4c418350249026105ad04b.glb","verifiedSha256":"9c9ba21fd343f28fb2a1c4830a1395555ff33fe59a4c418350249026105ad04b","originalSourceRecord":"./object-store/sources/music-perspective-windows.txt","originalAudioUrl":"./object-store/audio/perspective-windows.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/perspective-windows.wav"},{"id":"music-quiet-well","title":"Quiet well","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-quiet-well.txt","sourceType":"project","revision":"Listening garden v1","assetId":"e7e2810d299b6a5b473283b64b216bcd41e65aad6d977beb161d4befb28a4959","bytes":88596,"scale":1.6,"action":"reflect","audioSha256":"a9f6db59fc9358074eccde9c648bece467a5a6dd295e5da00db2b8adc0f349c2","audioBytes":1264244,"duration":28.666666666666668,"description":"An original 29-second instrumental miniature with a physical musical poster. Notice a pause. What could a quiet place in your house make possible?","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/e7e2810d299b6a5b473283b64b216bcd41e65aad6d977beb161d4befb28a4959.glb","verifiedSha256":"e7e2810d299b6a5b473283b64b216bcd41e65aad6d977beb161d4befb28a4959","originalSourceRecord":"./object-store/sources/music-quiet-well.txt","originalAudioUrl":"./object-store/audio/quiet-well.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/quiet-well.wav"},{"id":"music-city-of-tomorrow","title":"City of tomorrow","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-city-of-tomorrow.txt","sourceType":"project","revision":"Listening garden v1","assetId":"ed9be7469af7ffb3dd18b1e923813bc9a1025a14e82699f22e05fe716db9787e","bytes":88592,"scale":1.6,"action":"reflect","audioSha256":"c7de72ee144d2b17ba2e47a273f39929a51cccca8f4ed085daa5919cd66d5940","audioBytes":902398,"duration":20.46153846153846,"description":"An original 20-second instrumental miniature with a physical musical poster. Imagine a city this music could accompany. Name one activity that belongs there.","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/ed9be7469af7ffb3dd18b1e923813bc9a1025a14e82699f22e05fe716db9787e.glb","verifiedSha256":"ed9be7469af7ffb3dd18b1e923813bc9a1025a14e82699f22e05fe716db9787e","originalSourceRecord":"./object-store/sources/music-city-of-tomorrow.txt","originalAudioUrl":"./object-store/audio/city-of-tomorrow.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/city-of-tomorrow.wav"},{"id":"music-return-home","title":"Return home","category":"Music posters","creator":"House of Ideas project · procedural instrumental composition","license":"Original project composition and poster; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-market-music.mjs","sourceRecord":"./city-source-assets/object-store/sources/music-return-home.txt","sourceType":"project","revision":"Listening garden v1","assetId":"a6e3b38d79627100e0b664ebb9980b7798c4bae50c9b2da5784bf86466b73dc9","bytes":88596,"scale":1.6,"action":"reflect","audioSha256":"691b702484b8bcc225105f8ff762c74618fb8819cadd9c48568ae6f5369a7428","audioBytes":1173784,"duration":26.615384615384617,"description":"An original 27-second instrumental miniature with a physical musical poster. Compare the opening and ending. What does returning home mean after exploring?","modifications":"Original melody, additive synthesis and geometric 3D poster created for this project. No external recording, artist image or audio sample used.","type":"model","assetPath":"./city-source-assets/object-store/assets/a6e3b38d79627100e0b664ebb9980b7798c4bae50c9b2da5784bf86466b73dc9.glb","verifiedSha256":"a6e3b38d79627100e0b664ebb9980b7798c4bae50c9b2da5784bf86466b73dc9","originalSourceRecord":"./object-store/sources/music-return-home.txt","originalAudioUrl":"./object-store/audio/return-home.wav","audioAvailable":true,"audioNote":"The original project composition is bundled locally with its source provenance.","hasOriginalAudio":true,"audioUrl":"./city-source-assets/object-store/audio/return-home.wav"},{"id":"explore-chance-die","title":"Probability die","scale":1.2,"description":"A giant spotted die on a circular stage. Roll it and compare a small sample with a larger one. Activity: predict which face will appear most often, then test your prediction.","action":"experiment","experimentId":"chance-die","category":"Exploration objects","creator":"House of Ideas project","license":"Original project geometry; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/exploration-objects.js","sourceRecord":"./city-source-assets/object-store/sources/chance-die.txt","sourceType":"project","revision":"Exploration collection v1","assetId":"5fc80c6c71fc20e9f3c81db5065adf08ba1a561862ddc71a7326d53c456f423f","bytes":203740,"modifications":"Original static 3D sculpture with an offline interactive experiment panel. No external models, images or textures used.","type":"model","assetPath":"./city-source-assets/object-store/assets/5fc80c6c71fc20e9f3c81db5065adf08ba1a561862ddc71a7326d53c456f423f.glb","verifiedSha256":"5fc80c6c71fc20e9f3c81db5065adf08ba1a561862ddc71a7326d53c456f423f","originalSourceRecord":"./object-store/sources/chance-die.txt"},{"id":"explore-pendulum-lab","title":"Pendulum laboratory","scale":1.5,"description":"Three suspended bobs invite a study of time. Change length and gravity to calculate an ideal small-angle period. Activity: predict which change doubles the period. The sculpture is static; the calculation is an ideal model.","action":"experiment","experimentId":"pendulum-lab","category":"Exploration objects","creator":"House of Ideas project","license":"Original project geometry; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/exploration-objects.js","sourceRecord":"./city-source-assets/object-store/sources/pendulum-lab.txt","sourceType":"project","revision":"Exploration collection v1","assetId":"39f614f683a400b92b73c7f679141da8322c024fe200fab03af31b5f7a263197","bytes":74584,"modifications":"Original static 3D sculpture with an offline interactive experiment panel. No external models, images or textures used.","type":"model","assetPath":"./city-source-assets/object-store/assets/39f614f683a400b92b73c7f679141da8322c024fe200fab03af31b5f7a263197.glb","verifiedSha256":"39f614f683a400b92b73c7f679141da8322c024fe200fab03af31b5f7a263197","originalSourceRecord":"./object-store/sources/pendulum-lab.txt"},{"id":"explore-mobius-ribbon","title":"Möbius ribbon","scale":1.3,"description":"A continuous band with a half twist. Trace its centre line and watch the orientation reverse after one lap. Activity: explain why two laps are needed to return to the original orientation.","action":"experiment","experimentId":"mobius-ribbon","category":"Exploration objects","creator":"House of Ideas project","license":"Original project geometry; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/exploration-objects.js","sourceRecord":"./city-source-assets/object-store/sources/mobius-ribbon.txt","sourceType":"project","revision":"Exploration collection v1","assetId":"14c5166166d74f3cc8a0f8bdba969046570eb45a4c582b9b30136664ab9756a3","bytes":114404,"modifications":"Original static 3D sculpture with an offline interactive experiment panel. No external models, images or textures used.","type":"model","assetPath":"./city-source-assets/object-store/assets/14c5166166d74f3cc8a0f8bdba969046570eb45a4c582b9b30136664ab9756a3.glb","verifiedSha256":"14c5166166d74f3cc8a0f8bdba969046570eb45a4c582b9b30136664ab9756a3","originalSourceRecord":"./object-store/sources/mobius-ribbon.txt"},{"id":"explore-colour-prism","title":"Prism of possible colours","scale":1.3,"description":"A triangular prism stands beside a fan of coloured rays. Mix red, green and blue light in a digital swatch. Activity: predict which two channels make yellow. This models additive screen colour, not paint mixing or a physical optical simulation.","action":"experiment","experimentId":"colour-prism","category":"Exploration objects","creator":"House of Ideas project","license":"Original project geometry; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/exploration-objects.js","sourceRecord":"./city-source-assets/object-store/sources/colour-prism.txt","sourceType":"project","revision":"Exploration collection v1","assetId":"2e77690a27f185f1e412838a0c224060dfddc4244b568b9ccae27a36c928b564","bytes":13456,"modifications":"Original static 3D sculpture with an offline interactive experiment panel. No external models, images or textures used.","type":"model","assetPath":"./city-source-assets/object-store/assets/2e77690a27f185f1e412838a0c224060dfddc4244b568b9ccae27a36c928b564.glb","verifiedSha256":"2e77690a27f185f1e412838a0c224060dfddc4244b568b9ccae27a36c928b564","originalSourceRecord":"./object-store/sources/colour-prism.txt"},{"id":"explore-hanoi-towers","title":"Towers of Hanoi","scale":1.5,"description":"Three pegs and three rings make a puzzle of planning. Move one top ring at a time; a larger ring cannot sit on a smaller one. Activity: transfer all three rings to the right peg and explain your strategy.","action":"experiment","experimentId":"hanoi-towers","category":"Exploration objects","creator":"House of Ideas project","license":"Original project geometry; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/exploration-objects.js","sourceRecord":"./city-source-assets/object-store/sources/hanoi-towers.txt","sourceType":"project","revision":"Exploration collection v1","assetId":"65a8131dea3011d5f3300a379bc881c07c4cb8e97d6ae70d74a3563e25565dd4","bytes":124580,"modifications":"Original static 3D sculpture with an offline interactive experiment panel. No external models, images or textures used.","type":"model","assetPath":"./city-source-assets/object-store/assets/65a8131dea3011d5f3300a379bc881c07c4cb8e97d6ae70d74a3563e25565dd4.glb","verifiedSha256":"65a8131dea3011d5f3300a379bc881c07c4cb8e97d6ae70d74a3563e25565dd4","originalSourceRecord":"./object-store/sources/hanoi-towers.txt"},{"id":"explore-prime-cabinet","title":"Cabinet of indivisible numbers","scale":1.4,"description":"Compartments hold groups of two, three, five and seven beads. Test whole numbers and discover a factor when they are composite. Activity: explain why one is not prime and what evidence proves a number is composite.","action":"experiment","experimentId":"prime-cabinet","category":"Exploration objects","creator":"House of Ideas project","license":"Original project geometry; see project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/exploration-objects.js","sourceRecord":"./city-source-assets/object-store/sources/prime-cabinet.txt","sourceType":"project","revision":"Exploration collection v1","assetId":"610bba43a8c90a8b7e7d1d394056c77ddbb3118c7379c76dd7380cc414f1de58","bytes":373636,"modifications":"Original static 3D sculpture with an offline interactive experiment panel. No external models, images or textures used.","type":"model","assetPath":"./city-source-assets/object-store/assets/610bba43a8c90a8b7e7d1d394056c77ddbb3118c7379c76dd7380cc414f1de58.glb","verifiedSha256":"610bba43a8c90a8b7e7d1d394056c77ddbb3118c7379c76dd7380cc414f1de58","originalSourceRecord":"./object-store/sources/prime-cabinet.txt"},{"id":"reflection_lamp","title":"Reflection lamp","description":"Pause and record what changed your mind.","type":"furnishing","category":"Learning furniture","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/residence-scene-v1.js"},{"id":"question_board","title":"Question board","description":"Clarify a claim and look for a counterexample.","type":"furnishing","category":"Learning furniture","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/residence-scene-v1.js"},{"id":"experiment_table","title":"Experiment table","description":"Make a prediction, then compare it with an observation.","type":"furnishing","category":"Learning furniture","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/residence-scene-v1.js"},{"id":"discussion_circle","title":"Discussion circle","description":"Take two perspectives in turn.","type":"furnishing","category":"Learning furniture","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/residence-scene-v1.js"},{"id":"idea-book","cue":"book","title":"Book idea object","type":"idea","category":"Idea objects","description":"Give a note, question or experiment a physical place in your room.","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-display.js"},{"id":"idea-crystal","cue":"crystal","title":"Crystal idea object","type":"idea","category":"Idea objects","description":"Give a note, question or experiment a physical place in your room.","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-display.js"},{"id":"idea-ring","cue":"ring","title":"Ring idea object","type":"idea","category":"Idea objects","description":"Give a note, question or experiment a physical place in your room.","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-display.js"},{"id":"idea-sphere","cue":"sphere","title":"Sphere idea object","type":"idea","category":"Idea objects","description":"Give a note, question or experiment a physical place in your room.","creator":"House of Ideas","license":"Project source","sourceUrl":"https://github.com/hadi1373z/house-of-ideas/blob/main/web/idea-display.js"},{"id":"painting:water-lilies","title":"Water Lilies","date":"1906","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_water-lilies.webp","alt":"Water Lilies. A pond fills the frame.","description":"A pond fills the frame. Floating leaves interrupt a field of reflected sky; distance is suggested by color rather than a horizon.","sourceUrl":"https://api.artic.edu/api/v1/artworks/16568","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg","citation":"Claude Monet, Water Lilies, 1906. Oil on canvas. Art Institute of Chicago. https://api.artic.edu/api/v1/artworks/16568","dimensions":"89.9 × 94.1 cm","collection":"Art Institute of Chicago","artistId":"monet","artistName":"Claude Monet","type":"painting","category":"Paintings","creator":"Claude Monet","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg","originalImageUrl":"./art-city/artworks/monet_water-lilies.webp"},{"id":"painting:impression-sunrise","title":"Impression, Sunrise","date":"1872","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_impression-sunrise.webp","alt":"Impression, Sunrise. A small orange sun and its reflection hold their place against a harbor of blue-gray strokes.","description":"A small orange sun and its reflection hold their place against a harbor of blue-gray strokes. Boats arrive as dark, economical silhouettes.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","citation":"Claude Monet, Impression, Sunrise, 1872. Oil on canvas. Musée Marmottan Monet. https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","dimensions":"48 × 63 cm","collection":"Musée Marmottan Monet","artistId":"monet","artistName":"Claude Monet","type":"painting","category":"Paintings","creator":"Claude Monet","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Monet_-_Impression%2C_Sunrise.jpg","originalImageUrl":"./art-city/artworks/monet_impression-sunrise.webp"},{"id":"painting:woman-with-a-parasol","title":"Woman with a Parasol — Madame Monet and Her Son","date":"1875","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_woman-with-a-parasol.webp","alt":"Woman with a Parasol — Madame Monet and Her Son. The viewpoint is low and the sky expansive.","description":"The viewpoint is low and the sky expansive. Dress, grass, and clouds appear caught in the same movement of air.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","citation":"Claude Monet, Woman with a Parasol — Madame Monet and Her Son, 1875. Oil on canvas. National Gallery of Art. https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","dimensions":"100 × 81 cm","collection":"National Gallery of Art","artistId":"monet","artistName":"Claude Monet","type":"painting","category":"Paintings","creator":"Claude Monet","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/monet_woman-with-a-parasol.webp"},{"id":"painting:poppy-field","title":"Poppy Field","date":"1873","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_poppy-field.webp","alt":"Poppy Field. Bright red marks lead the eye through pale grasses.","description":"Bright red marks lead the eye through pale grasses. The figures are part of the field’s rhythm, not isolated from it.","sourceUrl":"https://www.musee-orsay.fr/en/artworks/coquelicots-1010","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Poppy_Field_-_Google_Art_Project.jpg","citation":"Claude Monet, Poppy Field, 1873. Oil on canvas. Musée d’Orsay. https://www.musee-orsay.fr/en/artworks/coquelicots-1010","dimensions":"50 × 65 cm","collection":"Musée d’Orsay","artistId":"monet","artistName":"Claude Monet","type":"painting","category":"Paintings","creator":"Claude Monet","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Poppy_Field_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/monet_poppy-field.webp"},{"id":"painting:japanese-footbridge","title":"The Japanese Footbridge","date":"1899","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_japanese-footbridge.webp","alt":"The Japanese Footbridge. The bridge draws a firm arc through foliage.","description":"The bridge draws a firm arc through foliage. Beneath it, floating plants and reflections loosen the distinction between solid and liquid.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","citation":"Claude Monet, The Japanese Footbridge, 1899. Oil on canvas. National Gallery of Art. https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","dimensions":"81.3 × 101.6 cm","collection":"National Gallery of Art","artistId":"monet","artistName":"Claude Monet","type":"painting","category":"Paintings","creator":"Claude Monet","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Japanese_Footbridge-Claude_Monet.jpg","originalImageUrl":"./art-city/artworks/monet_japanese-footbridge.webp"},{"id":"painting:water-lilies-and-bridge","title":"Water Lilies and Japanese Bridge","date":"1899","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/monet_water-lilies-and-bridge.webp","alt":"Water Lilies and Japanese Bridge. The garden closes around a footbridge, while the pool opens another space below.","description":"The garden closes around a footbridge, while the pool opens another space below. Similar greens take on different weights in water and air.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","citation":"Claude Monet, Water Lilies and Japanese Bridge, 1899. Oil on canvas. Princeton University Art Museum. https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","dimensions":"90.5 × 89.7 cm","collection":"Princeton University Art Museum","artistId":"monet","artistName":"Claude Monet","type":"painting","category":"Paintings","creator":"Claude Monet","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_and_Japanese_Bridge_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/monet_water-lilies-and-bridge.webp"},{"id":"painting:composition-eight","title":"Composition VIII","date":"1923","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_composition-eight.webp","alt":"Composition VIII. Circles, triangles, arcs, and diagonals share a pale field.","description":"Circles, triangles, arcs, and diagonals share a pale field. The composition has both the precision of a diagram and the unstable balance of a performance.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","citation":"Wassily Kandinsky, Composition VIII, 1923. Oil on canvas. Solomon R. Guggenheim Museum. https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","dimensions":"140 × 201 cm","collection":"Solomon R. Guggenheim Museum","artistId":"kandinsky","artistName":"Wassily Kandinsky","type":"painting","category":"Paintings","creator":"Wassily Kandinsky","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg","originalImageUrl":"./art-city/artworks/kandinsky_composition-eight.webp"},{"id":"painting:composition-seven","title":"Composition VII","date":"1913","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_composition-seven.webp","alt":"Composition VII. A dense current of marks resists a single focal point.","description":"A dense current of marks resists a single focal point. The painting opens through repeated looking: a pale passage, a dark knot, a sudden turn.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","citation":"Wassily Kandinsky, Composition VII, 1913. Oil on canvas. State Tretyakov Gallery. https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","dimensions":"Approx. 200 × 300 cm","collection":"State Tretyakov Gallery","artistId":"kandinsky","artistName":"Wassily Kandinsky","type":"painting","category":"Paintings","creator":"Wassily Kandinsky","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1913_-_Composition_7.jpg","originalImageUrl":"./art-city/artworks/kandinsky_composition-seven.webp"},{"id":"painting:yellow-red-blue","title":"Yellow–Red–Blue","date":"1925","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_yellow-red-blue.webp","alt":"Yellow–Red–Blue. A yellow structure and a large blue circle pull in different directions.","description":"A yellow structure and a large blue circle pull in different directions. Lines cross the space between them like another layer of thought.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","citation":"Wassily Kandinsky, Yellow–Red–Blue, 1925. Oil on canvas. Centre Pompidou. https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","dimensions":"128 × 201.5 cm","collection":"Centre Pompidou","artistId":"kandinsky","artistName":"Wassily Kandinsky","type":"painting","category":"Paintings","creator":"Wassily Kandinsky","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Jaune_Rouge_Bleu.jpg","originalImageUrl":"./art-city/artworks/kandinsky_yellow-red-blue.webp"},{"id":"painting:several-circles","title":"Several Circles","date":"1926","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_several-circles.webp","alt":"Several Circles. Translucent discs overlap against a dark ground.","description":"Translucent discs overlap against a dark ground. Color becomes luminous at their edges, suggesting depth without a conventional setting.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","citation":"Wassily Kandinsky, Several Circles, 1926. Oil on canvas. Solomon R. Guggenheim Museum. https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","dimensions":"140.3 × 140.7 cm","collection":"Solomon R. Guggenheim Museum","artistId":"kandinsky","artistName":"Wassily Kandinsky","type":"painting","category":"Paintings","creator":"Wassily Kandinsky","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky%2C_1926_-_Several_Circles%2C_Gugg_0910_25.jpg","originalImageUrl":"./art-city/artworks/kandinsky_several-circles.webp"},{"id":"painting:black-and-violet","title":"Black and Violet","date":"1923","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_black-and-violet.webp","alt":"Black and Violet. Large dark forms are held in tension by fine lines and small accents.","description":"Large dark forms are held in tension by fine lines and small accents. The open background is an active part of the arrangement.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","citation":"Wassily Kandinsky, Black and Violet, 1923. Oil on canvas. See source record. https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","dimensions":"77.8 × 100.4 cm","collection":"See source record","artistId":"kandinsky","artistName":"Wassily Kandinsky","type":"painting","category":"Paintings","creator":"Wassily Kandinsky","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Kandinsky_-_Black_and_Violet%2C_1923.jpg","originalImageUrl":"./art-city/artworks/kandinsky_black-and-violet.webp"},{"id":"painting:study-seven","title":"Study for Composition VII, No. 2","date":"1913","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/kandinsky_study-seven.webp","alt":"Study for Composition VII, No. 2. An expansive study in which color masses gather, dissolve, and change direction.","description":"An expansive study in which color masses gather, dissolve, and change direction. Its loose passages make the process of composition visible.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","citation":"Wassily Kandinsky, Study for Composition VII, No. 2, 1913. Oil on canvas. Lenbachhaus. https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","dimensions":"100 × 140 cm","collection":"Lenbachhaus","artistId":"kandinsky","artistName":"Wassily Kandinsky","type":"painting","category":"Paintings","creator":"Wassily Kandinsky","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Wassily_Kandinsky_-_Studie_zu_Komposition_VII_(Entwurf_2)_-_GMS_64_-_Lenbachhaus.jpg","originalImageUrl":"./art-city/artworks/kandinsky_study-seven.webp"},{"id":"painting:starry-night","title":"The Starry Night","date":"1889","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_starry-night.webp","alt":"The Starry Night. The sky occupies most of the canvas.","description":"The sky occupies most of the canvas. Curves of blue and pale yellow sweep past the upright cypress and the quieter geometry of the village.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, The Starry Night, 1889. Oil on canvas. The Museum of Modern Art. https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","dimensions":"73.7 × 92.1 cm","collection":"The Museum of Modern Art","artistId":"van-gogh","artistName":"Vincent van Gogh","type":"painting","category":"Paintings","creator":"Vincent van Gogh","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/van-gogh_starry-night.webp"},{"id":"painting:almond-blossom","title":"Almond Blossom","date":"1890","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_almond-blossom.webp","alt":"Almond Blossom. Pale blossoms spread across an uninterrupted blue.","description":"Pale blossoms spread across an uninterrupted blue. The branches make a network that can be followed from one edge of the painting to another.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, Almond Blossom, 1890. Oil on canvas. Van Gogh Museum. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","dimensions":"73.3 × 92.4 cm","collection":"Van Gogh Museum","artistId":"van-gogh","artistName":"Vincent van Gogh","type":"painting","category":"Paintings","creator":"Vincent van Gogh","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/van-gogh_almond-blossom.webp"},{"id":"painting:sunflowers","title":"Sunflowers (Munich version)","date":"1888","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_sunflowers.webp","alt":"Sunflowers (Munich version). Petals, seeds, and leaves give each flower a different texture.","description":"Petals, seeds, and leaves give each flower a different texture. The vase gathers them into a still life that remains full of irregular movement.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","citation":"Vincent van Gogh, Sunflowers (Munich version), 1888. Oil on canvas. Neue Pinakothek. https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","dimensions":"91 × 72 cm","collection":"Neue Pinakothek","artistId":"van-gogh","artistName":"Vincent van Gogh","type":"painting","category":"Paintings","creator":"Vincent van Gogh","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Zw%C3%B6lf_Sonnenblumen_in_einer_Vase.jpeg","originalImageUrl":"./art-city/artworks/van-gogh_sunflowers.webp"},{"id":"painting:rhone","title":"Starry Night over the Rhône","date":"1888","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_rhone.webp","alt":"Starry Night over the Rhône. Points of light stretch into the river.","description":"Points of light stretch into the river. Above and below the horizon, short yellow strokes turn darkness into a sequence of reflections.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, Starry Night over the Rhône, 1888. Oil on canvas. Musée d’Orsay. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","dimensions":"72.5 × 92 cm","collection":"Musée d’Orsay","artistId":"van-gogh","artistName":"Vincent van Gogh","type":"painting","category":"Paintings","creator":"Vincent van Gogh","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/van-gogh_rhone.webp"},{"id":"painting:bedroom","title":"The Bedroom","date":"1888","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_bedroom.webp","alt":"The Bedroom. The room is built from strongly outlined furniture and tilted planes.","description":"The room is built from strongly outlined furniture and tilted planes. Empty space around the bed becomes as distinctive as the objects themselves.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, The Bedroom, 1888. Oil on canvas. Van Gogh Museum. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","dimensions":"72 × 90 cm","collection":"Van Gogh Museum","artistId":"van-gogh","artistName":"Vincent van Gogh","type":"painting","category":"Paintings","creator":"Vincent van Gogh","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/van-gogh_bedroom.webp"},{"id":"painting:wheatfield","title":"Wheatfield with Crows","date":"1890","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/van-gogh_wheatfield.webp","alt":"Wheatfield with Crows. Paths interrupt the gold of the field while dark birds mark the sky.","description":"Paths interrupt the gold of the field while dark birds mark the sky. The wide format places the viewer close to an unresolved stretch of land.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","citation":"Vincent van Gogh, Wheatfield with Crows, 1890. Oil on canvas. Van Gogh Museum. https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","dimensions":"50.2 × 103 cm","collection":"Van Gogh Museum","artistId":"van-gogh","artistName":"Vincent van Gogh","type":"painting","category":"Paintings","creator":"Vincent van Gogh","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/van-gogh_wheatfield.webp"},{"id":"painting:great-wave","title":"Under the Wave off Kanagawa","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_great-wave.webp","alt":"Under the Wave off Kanagawa. The wave curls over the boats, while Mount Fuji sits inside the opening below it.","description":"The wave curls over the boats, while Mount Fuji sits inside the opening below it. The small distant mountain and the immense foreground wave share a pointed profile.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","citation":"Katsushika Hokusai, Under the Wave off Kanagawa, c. 1830–1832. Color woodblock print on paper. See impression record. https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","dimensions":"Horizontal ōban; dimensions vary by impression","collection":"See impression record","artistId":"hokusai","artistName":"Katsushika Hokusai","type":"painting","category":"Paintings","creator":"Katsushika Hokusai","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_Off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/hokusai_great-wave.webp"},{"id":"painting:red-fuji","title":"Fine Wind, Clear Morning","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_red-fuji.webp","alt":"Fine Wind, Clear Morning. The mountain’s red slope meets a blue sky patterned with white clouds.","description":"The mountain’s red slope meets a blue sky patterned with white clouds. Human activity disappears, leaving large planes of color and the shape of the summit.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","citation":"Katsushika Hokusai, Fine Wind, Clear Morning, c. 1830–1832. Color woodblock print on paper. Indianapolis Museum of Art at Newfields. https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","dimensions":"26 × 38 cm (this impression)","collection":"Indianapolis Museum of Art at Newfields","artistId":"hokusai","artistName":"Katsushika Hokusai","type":"painting","category":"Paintings","creator":"Katsushika Hokusai","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Katsushika_Hokusai_-_Fine_Wind%2C_Clear_Morning_(Gaif%C5%AB_kaisei)_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/hokusai_red-fuji.webp"},{"id":"painting:kajikazawa","title":"Kajikazawa in Kai Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_kajikazawa.webp","alt":"Kajikazawa in Kai Province. Fishing lines extend from a rocky ledge toward moving water.","description":"Fishing lines extend from a rocky ledge toward moving water. Their triangular arrangement answers the outline of Fuji beyond.","sourceUrl":"https://www.metmuseum.org/art/collection/search/56727","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Kajikazawa_in_Kai_Province_(Koshu_Kajikazawa).jpg","citation":"Katsushika Hokusai, Kajikazawa in Kai Province, c. 1830–1832. Color woodblock print on paper. See impression record. https://www.metmuseum.org/art/collection/search/56727","dimensions":"Horizontal ōban; dimensions vary by impression","collection":"See impression record","artistId":"hokusai","artistName":"Katsushika Hokusai","type":"painting","category":"Paintings","creator":"Katsushika Hokusai","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Kajikazawa_in_Kai_Province_(Koshu_Kajikazawa).jpg","originalImageUrl":"./art-city/artworks/hokusai_kajikazawa.webp"},{"id":"painting:ejiri","title":"Ejiri in Suruga Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_ejiri.webp","alt":"Ejiri in Suruga Province. Wind lifts papers and bends the trees along a winding path.","description":"Wind lifts papers and bends the trees along a winding path. Fuji remains still on the horizon, a counterpoint to the foreground’s agitation.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","rights":"The Metropolitan Museum of Art, Henry L. Phillips Collection, 1939. Public Domain / Open Access.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","citation":"Katsushika Hokusai, Ejiri in Suruga Province, c. 1830–1832. Color woodblock print on paper. Multiple impressions; see the image record for the reproduced impression. https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","dimensions":"Horizontal ōban print; dimensions vary by impression","collection":"Multiple impressions; see the image record for the reproduced impression","artistId":"hokusai","artistName":"Katsushika Hokusai","type":"painting","category":"Paintings","creator":"Katsushika Hokusai","license":"The Metropolitan Museum of Art, Henry L. Phillips Collection, 1939. Public Domain / Open Access.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Ejiri_in_the_Suruga_province.jpg","originalImageUrl":"./art-city/artworks/hokusai_ejiri.webp"},{"id":"painting:mishima","title":"Mishima Pass in Kai Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_mishima.webp","alt":"Mishima Pass in Kai Province. Travelers gather beside a large tree.","description":"Travelers gather beside a large tree. The close trunk sets a human scale against the layered landscape beyond.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","citation":"Katsushika Hokusai, Mishima Pass in Kai Province, c. 1830–1832. Color woodblock print on paper. Multiple impressions; see the image record for the reproduced impression. https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","dimensions":"Horizontal ōban print; dimensions vary by impression","collection":"Multiple impressions; see the image record for the reproduced impression","artistId":"hokusai","artistName":"Katsushika Hokusai","type":"painting","category":"Paintings","creator":"Katsushika Hokusai","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hokusai29_mishima-pass.jpg","originalImageUrl":"./art-city/artworks/hokusai_mishima.webp"},{"id":"painting:tsukuda","title":"Tsukuda Island in Musashi Province","date":"c. 1830–1832","medium":"Color woodblock print on paper","imageUrl":"./city-source-assets/art-city/artworks/hokusai_tsukuda.webp","alt":"Tsukuda Island in Musashi Province. Boats cross a broad plane of water.","description":"Boats cross a broad plane of water. The coast and its small buildings form an interval between the nearby vessels and distant Fuji.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","citation":"Katsushika Hokusai, Tsukuda Island in Musashi Province, c. 1830–1832. Color woodblock print on paper. Multiple impressions; see the image record for the reproduced impression. https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","dimensions":"Horizontal ōban print; dimensions vary by impression","collection":"Multiple impressions; see the image record for the reproduced impression","artistId":"hokusai","artistName":"Katsushika Hokusai","type":"painting","category":"Paintings","creator":"Katsushika Hokusai","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hokusai16_tsukuda-island.jpg","originalImageUrl":"./art-city/artworks/hokusai_tsukuda.webp"},{"id":"painting:thinker","title":"The Thinker","date":"Modeled c. 1880; cast c. 1910","medium":"Bronze","imageUrl":"./city-source-assets/art-city/artworks/rodin_thinker.webp","alt":"The Thinker. A compact seated body carries a dense network of tensions: bent back, resting elbow, compressed limbs.","description":"A compact seated body carries a dense network of tensions: bent back, resting elbow, compressed limbs. Thought is made visible as physical effort.","sourceUrl":"https://www.metmuseum.org/art/collection/search/191811","rights":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Thinker_MET_DP-13618-011.jpg","citation":"Auguste Rodin, The Thinker, Modeled c. 1880; cast c. 1910. Bronze. The Metropolitan Museum of Art, 11.173.9. https://www.metmuseum.org/art/collection/search/191811","dimensions":"Height: 70.2 cm","collection":"The Metropolitan Museum of Art, 11.173.9","artistId":"rodin","artistName":"Auguste Rodin","type":"painting","category":"Paintings","creator":"Auguste Rodin","license":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:The_Thinker_MET_DP-13618-011.jpg","originalImageUrl":"./art-city/artworks/rodin_thinker.webp"},{"id":"painting:eternal-spring","title":"Eternal Spring","date":"Modeled c. 1881; carved 1907","medium":"Marble","imageUrl":"./city-source-assets/art-city/artworks/rodin_eternal-spring.webp","alt":"Eternal Spring. Two figures make a continuous arrangement of torsos and limbs.","description":"Two figures make a continuous arrangement of torsos and limbs. The work moves between the independent bodies and the single silhouette they create.","sourceUrl":"https://www.metmuseum.org/art/collection/search/193438","rights":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Eternal_Spring_MET_DP-13618-015.jpg","citation":"Auguste Rodin, Eternal Spring, Modeled c. 1881; carved 1907. Marble. The Metropolitan Museum of Art, 17.120.184. https://www.metmuseum.org/art/collection/search/193438","dimensions":"71.1 × 73.7 × 45.7 cm","collection":"The Metropolitan Museum of Art, 17.120.184","artistId":"rodin","artistName":"Auguste Rodin","type":"painting","category":"Paintings","creator":"Auguste Rodin","license":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Eternal_Spring_MET_DP-13618-015.jpg","originalImageUrl":"./art-city/artworks/rodin_eternal-spring.webp"},{"id":"painting:walking-man","title":"The Walking Man","date":"Model completed before 1900; cast before 1914","medium":"Bronze, green patina","imageUrl":"./city-source-assets/art-city/artworks/rodin_walking-man.webp","alt":"The Walking Man. Without a head or arms, the figure concentrates attention on the spread of the legs and the weight of the torso.","description":"Without a head or arms, the figure concentrates attention on the spread of the legs and the weight of the torso. A step becomes the whole subject.","sourceUrl":"https://www.metmuseum.org/art/collection/search/198565","rights":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Walking_Man_(L%27homme_qui_marche)_MET_131267.jpg","citation":"Auguste Rodin, The Walking Man, Model completed before 1900; cast before 1914. Bronze, green patina. The Metropolitan Museum of Art, 40.12.4. https://www.metmuseum.org/art/collection/search/198565","dimensions":"Height: 85.1 cm","collection":"The Metropolitan Museum of Art, 40.12.4","artistId":"rodin","artistName":"Auguste Rodin","type":"painting","category":"Paintings","creator":"Auguste Rodin","license":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:The_Walking_Man_(L%27homme_qui_marche)_MET_131267.jpg","originalImageUrl":"./art-city/artworks/rodin_walking-man.webp"},{"id":"painting:age-of-bronze","title":"The Age of Bronze","date":"Modeled 1876; cast c. 1906","medium":"Bronze","imageUrl":"./city-source-assets/art-city/artworks/rodin_age-of-bronze.webp","alt":"The Age of Bronze. An upright figure holds its arms in different registers.","description":"An upright figure holds its arms in different registers. Its stance makes the body seem poised between waking, movement, and stillness.","sourceUrl":"https://www.metmuseum.org/art/collection/search/189265","rights":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Age_of_Bronze_(L%27Age_d%27airain)_MET_DP-13618-001.jpg","citation":"Auguste Rodin, The Age of Bronze, Modeled 1876; cast c. 1906. Bronze. The Metropolitan Museum of Art, 07.127. https://www.metmuseum.org/art/collection/search/189265","dimensions":"Height: 182.9 cm","collection":"The Metropolitan Museum of Art, 07.127","artistId":"rodin","artistName":"Auguste Rodin","type":"painting","category":"Paintings","creator":"Auguste Rodin","license":"Auguste Rodin; photograph: Joseph Coscia / The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:The_Age_of_Bronze_(L%27Age_d%27airain)_MET_DP-13618-001.jpg","originalImageUrl":"./art-city/artworks/rodin_age-of-bronze.webp"},{"id":"painting:madame-x","title":"Madame X","date":"Modeled c. 1907","medium":"Marble","imageUrl":"./city-source-assets/art-city/artworks/rodin_madame-x.webp","alt":"Madame X. A portrait emerges from a broad mass of marble.","description":"A portrait emerges from a broad mass of marble. Look at the change between the polished face and the less resolved stone surrounding it.","sourceUrl":"https://www.metmuseum.org/art/collection/search/191808","rights":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Madame_X_MET_183136.jpg","citation":"Auguste Rodin, Madame X, Modeled c. 1907. Marble. The Metropolitan Museum of Art, 11.173.6. https://www.metmuseum.org/art/collection/search/191808","dimensions":"49.5 × 54.3 × 48.3 cm","collection":"The Metropolitan Museum of Art, 11.173.6","artistId":"rodin","artistName":"Auguste Rodin","type":"painting","category":"Paintings","creator":"Auguste Rodin","license":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Madame_X_MET_183136.jpg","originalImageUrl":"./art-city/artworks/rodin_madame-x.webp"},{"id":"painting:hand-of-god","title":"The Hand of God","date":"Modeled c. 1896–1902; carved c. 1907","medium":"Marble","imageUrl":"./city-source-assets/art-city/artworks/rodin_hand-of-god.webp","alt":"The Hand of God. A large hand holds a small cluster of figures within the stone.","description":"A large hand holds a small cluster of figures within the stone. The work sets the scale of the maker against the scale of what is being formed.","sourceUrl":"https://www.metmuseum.org/art/collection/search/191046","rights":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:The_Hand_of_God_MET_131221.jpg","citation":"Auguste Rodin, The Hand of God, Modeled c. 1896–1902; carved c. 1907. Marble. The Metropolitan Museum of Art, 08.210. https://www.metmuseum.org/art/collection/search/191046","dimensions":"73.7 × 60.3 × 64.1 cm","collection":"The Metropolitan Museum of Art, 08.210","artistId":"rodin","artistName":"Auguste Rodin","type":"painting","category":"Paintings","creator":"Auguste Rodin","license":"Auguste Rodin; reproduction: The Metropolitan Museum of Art, Open Access (CC0 1.0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:The_Hand_of_God_MET_131221.jpg","originalImageUrl":"./art-city/artworks/rodin_hand-of-god.webp"},{"id":"painting:number-2","title":"The Ten Largest, No. 2, Childhood","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-2.webp","alt":"The Ten Largest, No. 2, Childhood. Warm orange forms and delicate lines float against blue.","description":"Warm orange forms and delicate lines float against blue. The painting invites both close inspection of its small signs and a sense of its enormous scale.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 2, Childhood, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","artistId":"hilma-af-klint","artistName":"Hilma af Klint","type":"painting","category":"Paintings","creator":"Hilma af Klint","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._2_-_Childhood_-_1907.jpg","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-2.webp"},{"id":"painting:number-3","title":"The Ten Largest, No. 3, Youth","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-3.webp","alt":"The Ten Largest, No. 3, Youth. Large loops and organic shapes press against a richly colored field.","description":"Large loops and organic shapes press against a richly colored field. Forms seem to open, join, and multiply.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 3, Youth, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","artistId":"hilma-af-klint","artistName":"Hilma af Klint","type":"painting","category":"Paintings","creator":"Hilma af Klint","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._3_-_Youth_-_1907.jpg","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-3.webp"},{"id":"painting:number-4","title":"The Ten Largest, No. 4, Youth","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-4.webp","alt":"The Ten Largest, No. 4, Youth. A dense constellation of curves and symbols unfolds across an orange ground.","description":"A dense constellation of curves and symbols unfolds across an orange ground. The whole composition is larger than a single glance can comfortably hold.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 4, Youth, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","artistId":"hilma-af-klint","artistName":"Hilma af Klint","type":"painting","category":"Paintings","creator":"Hilma af Klint","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._4_-_Youth_-_1907.jpg","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-4.webp"},{"id":"painting:number-5","title":"The Ten Largest, No. 5, Adulthood","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-5.webp","alt":"The Ten Largest, No. 5, Adulthood. Spirals, letters, and petal-like forms share the field.","description":"Spirals, letters, and petal-like forms share the field. The organization becomes a language of recurring relationships rather than a fixed key.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 5, Adulthood, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","artistId":"hilma-af-klint","artistName":"Hilma af Klint","type":"painting","category":"Paintings","creator":"Hilma af Klint","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._5_-_Adulthood_-_1907.jpg","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-5.webp"},{"id":"painting:number-7","title":"The Ten Largest, No. 7, Adulthood","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-7.webp","alt":"The Ten Largest, No. 7, Adulthood. Overlapping colored forms establish a patient, expansive rhythm.","description":"Overlapping colored forms establish a patient, expansive rhythm. Small inscriptions suggest a system without offering a complete explanation.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 7, Adulthood, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","artistId":"hilma-af-klint","artistName":"Hilma af Klint","type":"painting","category":"Paintings","creator":"Hilma af Klint","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._7_-_Adulthood_-_1907.jpg","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-7.webp"},{"id":"painting:number-9","title":"The Ten Largest, No. 9, Old Age","date":"1907","medium":"Tempera on paper mounted on canvas","imageUrl":"./city-source-assets/art-city/artworks/hilma-af-klint_number-9.webp","alt":"The Ten Largest, No. 9, Old Age. The composition turns toward pale ground and measured forms.","description":"The composition turns toward pale ground and measured forms. Its quieter intervals remain active: emptiness is part of the structure.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","citation":"Hilma af Klint, The Ten Largest, No. 9, Old Age, 1907. Tempera on paper mounted on canvas. The Hilma af Klint Foundation. https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","dimensions":"Monumental format, approximately 3.2 × 2.4 m","collection":"The Hilma af Klint Foundation","artistId":"hilma-af-klint","artistName":"Hilma af Klint","type":"painting","category":"Paintings","creator":"Hilma af Klint","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._9_-_1907.jpg","originalImageUrl":"./art-city/artworks/hilma-af-klint_number-9.webp"},{"id":"painting:gray-tree","title":"The Gray Tree","date":"1911","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_gray-tree.webp","alt":"The Gray Tree. Branches spread into a shallow gray field.","description":"Branches spread into a shallow gray field. The tree remains recognizable even as its structure begins to share the logic of the surrounding space.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","citation":"Piet Mondrian, The Gray Tree, 1911. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","dimensions":"Approx. 79 × 109 cm; see record","collection":"Kunstmuseum Den Haag","artistId":"mondrian","artistName":"Piet Mondrian","type":"painting","category":"Paintings","creator":"Piet Mondrian","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Gray_Tree_1911.jpg","originalImageUrl":"./art-city/artworks/mondrian_gray-tree.webp"},{"id":"painting:red-tree","title":"Evening (The Red Tree)","date":"1908–1910","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_red-tree.webp","alt":"Evening (The Red Tree). A red trunk and branching limbs hold their shape against blue.","description":"A red trunk and branching limbs hold their shape against blue. The tension between color and observed form is already the main event.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","citation":"Piet Mondrian, Evening (The Red Tree), 1908–1910. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","dimensions":"70 × 99 cm","collection":"Kunstmuseum Den Haag","artistId":"mondrian","artistName":"Piet Mondrian","type":"painting","category":"Paintings","creator":"Piet Mondrian","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian%2C_1908-10%2C_Evening%3B_Red_Tree_(Avond%3B_De_rode_boom)%2C_oil_on_canvas%2C_70_x_99_cm%2C_Gemeentemuseum_Den_Haag.jpg","originalImageUrl":"./art-city/artworks/mondrian_red-tree.webp"},{"id":"painting:apple-tree","title":"Flowering Apple Tree","date":"1912","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_apple-tree.webp","alt":"Flowering Apple Tree. The tree dissolves into arcs and faceted planes.","description":"The tree dissolves into arcs and faceted planes. A pale, restricted palette makes the relation of each line to its neighbors more visible.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","citation":"Piet Mondrian, Flowering Apple Tree, 1912. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","dimensions":"78.5 × 107.5 cm","collection":"Kunstmuseum Den Haag","artistId":"mondrian","artistName":"Piet Mondrian","type":"painting","category":"Paintings","creator":"Piet Mondrian","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Blossoming_apple_tree%2C_by_Piet_Mondriaan.jpg","originalImageUrl":"./art-city/artworks/mondrian_apple-tree.webp"},{"id":"painting:composition-red","title":"Composition with Red, Blue and Yellow","date":"1930","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_composition-red.webp","alt":"Composition with Red, Blue and Yellow. A large red plane dominates the square while small blue and yellow areas adjust its weight.","description":"A large red plane dominates the square while small blue and yellow areas adjust its weight. Unequal divisions produce a deliberate equilibrium.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","citation":"Piet Mondrian, Composition with Red, Blue and Yellow, 1930. Oil on canvas. Kunsthaus Zürich. https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","dimensions":"46 × 46 cm","collection":"Kunsthaus Zürich","artistId":"mondrian","artistName":"Piet Mondrian","type":"painting","category":"Paintings","creator":"Piet Mondrian","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg","originalImageUrl":"./art-city/artworks/mondrian_composition-red.webp"},{"id":"painting:composition-1921","title":"Composition with Large Red Plane, Yellow, Black, Gray and Blue","date":"1921","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_composition-1921.webp","alt":"Composition with Large Red Plane, Yellow, Black, Gray and Blue. A broad red area is held against several narrower divisions.","description":"A broad red area is held against several narrower divisions. The black lines vary in their relationship to the edge rather than functioning as a neutral frame.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","citation":"Piet Mondrian, Composition with Large Red Plane, Yellow, Black, Gray and Blue, 1921. Oil on canvas. Kunstmuseum Den Haag. https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","dimensions":"59.5 × 59.5 cm","collection":"Kunstmuseum Den Haag","artistId":"mondrian","artistName":"Piet Mondrian","type":"painting","category":"Paintings","creator":"Piet Mondrian","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondriaan%2C_1921_-_Composition_en_rouge%2C_jaune%2C_bleu_et_noir.jpg","originalImageUrl":"./art-city/artworks/mondrian_composition-1921.webp"},{"id":"painting:composition-1929","title":"Composition No. III, with Red, Blue, Yellow and Black","date":"1929","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/mondrian_composition-1929.webp","alt":"Composition No. III, with Red, Blue, Yellow and Black. The arrangement makes modest differences of scale consequential.","description":"The arrangement makes modest differences of scale consequential. White surfaces, black boundaries, and color all participate in the balance.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","citation":"Piet Mondrian, Composition No. III, with Red, Blue, Yellow and Black, 1929. Oil on canvas. Private collection; see the historical catalogue record. https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","dimensions":"50 × 50.2 cm","collection":"Private collection; see the historical catalogue record","artistId":"mondrian","artistName":"Piet Mondrian","type":"painting","category":"Paintings","creator":"Piet Mondrian","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Piet_Mondrian_-_Composition_No._III%2C_with_red%2C_blue%2C_yellow_and_black%2C_1929.jpg","originalImageUrl":"./art-city/artworks/mondrian_composition-1929.webp"},{"id":"painting:migrant-mother","title":"Migrant Mother, Nipomo, California","date":"1936","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_migrant-mother.webp","alt":"Migrant Mother, Nipomo, California. Florence Owens Thompson sits with children leaning against her.","description":"Florence Owens Thompson sits with children leaning against her. Their turned faces and her distant gaze give the compact group a strongly directional structure.","sourceUrl":"https://www.loc.gov/pictures/item/2017762891/","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg","citation":"Dorothea Lange, Migrant Mother, Nipomo, California, 1936. Black-and-white photograph. Library of Congress; digitized archival photograph. https://www.loc.gov/pictures/item/2017762891/","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","artistId":"lange","artistName":"Dorothea Lange","type":"painting","category":"Paintings","creator":"Dorothea Lange","license":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg","originalImageUrl":"./art-city/artworks/lange_migrant-mother.webp"},{"id":"painting:toward-la","title":"Toward Los Angeles, California","date":"1937","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_toward-la.webp","alt":"Toward Los Angeles, California. Two men walk along a road beneath a billboard advertising a different kind of travel.","description":"Two men walk along a road beneath a billboard advertising a different kind of travel. The photograph holds their journey and the commercial promise in the same frame.","sourceUrl":"https://www.loc.gov/item/2017769825/","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Toward_Los_Angeles%2C_California_LOC_3549663710.jpg","citation":"Dorothea Lange, Toward Los Angeles, California, 1937. Black-and-white photograph. Library of Congress; digitized archival photograph. https://www.loc.gov/item/2017769825/","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","artistId":"lange","artistName":"Dorothea Lange","type":"painting","category":"Paintings","creator":"Dorothea Lange","license":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Toward_Los_Angeles%2C_California_LOC_3549663710.jpg","originalImageUrl":"./art-city/artworks/lange_toward-la.webp"},{"id":"painting:children-camp","title":"Children of an Oklahoma Drought Refugee, California","date":"1936","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_children-camp.webp","alt":"Children of an Oklahoma Drought Refugee, California. Children appear within the setting of a migratory camp.","description":"Children appear within the setting of a migratory camp. The archive identifies the family through their displacement from Oklahoma; the photograph also asks for attention to each person in the frame.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","citation":"Dorothea Lange, Children of an Oklahoma Drought Refugee, California, 1936. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","artistId":"lange","artistName":"Dorothea Lange","type":"painting","category":"Paintings","creator":"Dorothea Lange","license":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Children_of_Oklahoma_drought_refugee_in_migratory_camp_in_California%2C_1936.jpg","originalImageUrl":"./art-city/artworks/lange_children-camp.webp"},{"id":"painting:dust-storm","title":"Dust Storm near Mills, New Mexico","date":"1935","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_dust-storm.webp","alt":"Dust Storm near Mills, New Mexico. The view records a dust storm near Mills.","description":"The view records a dust storm near Mills. Read the scene as both a landscape and evidence of conditions that shaped the lives of people working the land.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","citation":"Dorothea Lange, Dust Storm near Mills, New Mexico, 1935. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","artistId":"lange","artistName":"Dorothea Lange","type":"painting","category":"Paintings","creator":"Dorothea Lange","license":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Dust_storm_near_Mills%2C_New_Mexico%2C_1935.jpg","originalImageUrl":"./art-city/artworks/lange_dust-storm.webp"},{"id":"painting:pea-pickers-children","title":"Pea Pickers’ Children, Nipomo, California","date":"1935","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_pea-pickers-children.webp","alt":"Pea Pickers’ Children, Nipomo, California. A photograph of children in a pea-picking community.","description":"A photograph of children in a pea-picking community. The short archival caption places the scene within agricultural labor without supplying a complete account of the children’s lives.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","citation":"Dorothea Lange, Pea Pickers’ Children, Nipomo, California, 1935. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","artistId":"lange","artistName":"Dorothea Lange","type":"painting","category":"Paintings","creator":"Dorothea Lange","license":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Pea_pickers%27_children%2C_Nipomo%2C_California%2C_1935.jpg","originalImageUrl":"./art-city/artworks/lange_pea-pickers-children.webp"},{"id":"painting:roadside-blythe","title":"Drought Refugees from Oklahoma, near Blythe","date":"1936","medium":"Black-and-white photograph","imageUrl":"./city-source-assets/art-city/artworks/lange_roadside-blythe.webp","alt":"Drought Refugees from Oklahoma, near Blythe. The photograph records a roadside camp near Blythe.","description":"The photograph records a roadside camp near Blythe. Its title connects this temporary stopping place to a journey from Oklahoma.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","rights":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","citation":"Dorothea Lange, Drought Refugees from Oklahoma, near Blythe, 1936. Black-and-white photograph. Library of Congress; digitized archival photograph. https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","dimensions":"Digital reproduction; physical negative and print dimensions depend on the archival object","collection":"Library of Congress; digitized archival photograph","artistId":"lange","artistName":"Dorothea Lange","type":"painting","category":"Paintings","creator":"Dorothea Lange","license":"Dorothea Lange. U.S. federal agency photograph; public domain. Source record linked below.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Dorothea_Lange%2C_Drought_refugees_from_Oklahoma_camping_by_the_roadside%2C_Blythe%2C_California%2C_1936.jpg","originalImageUrl":"./art-city/artworks/lange_roadside-blythe.webp"},{"id":"painting:strawberry-thief","title":"Strawberry Thief","date":"1883","medium":"Printed cotton","imageUrl":"./city-source-assets/art-city/artworks/morris_strawberry-thief.webp","alt":"Strawberry Thief. Birds, fruit, and curling stems are held in a dense repeat.","description":"Birds, fruit, and curling stems are held in a dense repeat. Dark ground and small pale flowers let the pattern remain readable at several distances.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","citation":"William Morris, Strawberry Thief, 1883. Printed cotton. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","artistId":"morris","artistName":"William Morris","type":"painting","category":"Paintings","creator":"William Morris","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Morris_Strawberry_Thief_1883.jpg","originalImageUrl":"./art-city/artworks/morris_strawberry-thief.webp"},{"id":"painting:snakeshead","title":"Snakeshead","date":"1876","medium":"Printed cotton","imageUrl":"./city-source-assets/art-city/artworks/morris_snakeshead.webp","alt":"Snakeshead. Drooping flower heads sit within a framework of stems and foliage.","description":"Drooping flower heads sit within a framework of stems and foliage. Small changes of direction animate an otherwise measured repeat.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","citation":"William Morris, Snakeshead, 1876. Printed cotton. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","artistId":"morris","artistName":"William Morris","type":"painting","category":"Paintings","creator":"William Morris","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Morris_Snakeshead_printed_textile_1876.jpg","originalImageUrl":"./art-city/artworks/morris_snakeshead.webp"},{"id":"painting:willow-boughs","title":"Willow Boughs","date":"1887","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_willow-boughs.webp","alt":"Willow Boughs. Slender leaves overlap along curling branches.","description":"Slender leaves overlap along curling branches. The design is dense but not closed: pale spaces continue to circulate between the stems.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","citation":"William Morris, Willow Boughs, 1887. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","artistId":"morris","artistName":"William Morris","type":"painting","category":"Paintings","creator":"William Morris","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Morris_Willow_Bough_1887.jpg","originalImageUrl":"./art-city/artworks/morris_willow-boughs.webp"},{"id":"painting:trellis","title":"Trellis","date":"Designed 1862","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_trellis.webp","alt":"Trellis. Birds and climbing flowers cross a measured lattice.","description":"Birds and climbing flowers cross a measured lattice. Designed by William Morris, with the birds drawn by Philip Webb, the pattern brings the garden against a geometric framework.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","rights":"Design: William Morris, with birds by Philip Webb. Reproduction: The Metropolitan Museum of Art, Open Access (CC0); via Wikimedia Commons.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","citation":"William Morris, Trellis, Designed 1862. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","artistId":"morris","artistName":"William Morris","type":"painting","category":"Paintings","creator":"William Morris","license":"Design: William Morris, with birds by Philip Webb. Reproduction: The Metropolitan Museum of Art, Open Access (CC0); via Wikimedia Commons.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Trellis_MET_DP306738.jpg","originalImageUrl":"./art-city/artworks/morris_trellis.webp"},{"id":"painting:daisy","title":"Daisy","date":"1864","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_daisy.webp","alt":"Daisy. Small flowers rise from evenly spaced tufts of foliage.","description":"Small flowers rise from evenly spaced tufts of foliage. The ground remains visible, giving the repeat a lighter, more open rhythm.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","citation":"William Morris, Daisy, 1864. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","artistId":"morris","artistName":"William Morris","type":"painting","category":"Paintings","creator":"William Morris","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Morris_Daisy_wallpaper_1864.jpg","originalImageUrl":"./art-city/artworks/morris_daisy.webp"},{"id":"painting:acanthus","title":"Acanthus","date":"1875","medium":"Wallpaper design","imageUrl":"./city-source-assets/art-city/artworks/morris_acanthus.webp","alt":"Acanthus. Broad, curling leaves build a close, layered surface.","description":"Broad, curling leaves build a close, layered surface. The repeat depends on their shared movement rather than a conspicuous geometric frame.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","citation":"William Morris, Acanthus, 1875. Wallpaper design. See linked sample record. https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","dimensions":"Repeat design; dimensions vary by surviving sample","collection":"See linked sample record","artistId":"morris","artistName":"William Morris","type":"painting","category":"Paintings","creator":"William Morris","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Morris_Acanthus_Wallpaper_1875.jpg","originalImageUrl":"./art-city/artworks/morris_acanthus.webp"},{"id":"painting:senecio","title":"Senecio","date":"1922","medium":"Oil on gauze, mounted on cardboard","imageUrl":"./city-source-assets/art-city/artworks/klee_senecio.webp","alt":"Senecio. A face is assembled from broad planes and small irregularities.","description":"A face is assembled from broad planes and small irregularities. The eyes never quite settle into symmetry, keeping the figure alert and strange.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","citation":"Paul Klee, Senecio, 1922. Oil on gauze, mounted on cardboard. Kunstmuseum Basel. https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","dimensions":"40.3 × 37.4 cm","collection":"Kunstmuseum Basel","artistId":"klee","artistName":"Paul Klee","type":"painting","category":"Paintings","creator":"Paul Klee","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg","originalImageUrl":"./art-city/artworks/klee_senecio.webp"},{"id":"painting:twittering-machine","title":"Twittering Machine","date":"1922","medium":"Oil transfer and watercolor on paper","imageUrl":"./city-source-assets/art-city/artworks/klee_twittering-machine.webp","alt":"Twittering Machine. Bird-like forms perch on a drawn mechanism.","description":"Bird-like forms perch on a drawn mechanism. The thin line can be read as anatomy, notation, or apparatus without choosing only one.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","citation":"Paul Klee, Twittering Machine, 1922. Oil transfer and watercolor on paper. The Museum of Modern Art. https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","dimensions":"63.8 × 48.1 cm","collection":"The Museum of Modern Art","artistId":"klee","artistName":"Paul Klee","type":"painting","category":"Paintings","creator":"Paul Klee","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Die_Zwitscher-Maschine_(Twittering_Machine)%2C_1922_-_Paul_Klee.jpg","originalImageUrl":"./art-city/artworks/klee_twittering-machine.webp"},{"id":"painting:red-balloon","title":"Red Balloon","date":"1922","medium":"Oil on chalk-primed gauze mounted on board","imageUrl":"./city-source-assets/art-city/artworks/klee_red-balloon.webp","alt":"Red Balloon. A red circle floats above a compact arrangement of architectural shapes.","description":"A red circle floats above a compact arrangement of architectural shapes. The lightest-looking form becomes the strongest point of attention.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","citation":"Paul Klee, Red Balloon, 1922. Oil on chalk-primed gauze mounted on board. Solomon R. Guggenheim Museum. https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","dimensions":"31.8 × 31.1 cm","collection":"Solomon R. Guggenheim Museum","artistId":"klee","artistName":"Paul Klee","type":"painting","category":"Paintings","creator":"Paul Klee","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_1922%2C_Red_Balloon%2C_oil_on_chalk-primed_gauze%2C_mounted_on_board%2C_31.7_x_31.1_cm%2C_Solomon_R._Guggenheim_Museum.jpg","originalImageUrl":"./art-city/artworks/klee_red-balloon.webp"},{"id":"painting:fish-magic","title":"Fish Magic","date":"1925","medium":"Oil and watercolor on canvas on panel","imageUrl":"./city-source-assets/art-city/artworks/klee_fish-magic.webp","alt":"Fish Magic. Fish, flowers, and signs emerge from a dark field.","description":"Fish, flowers, and signs emerge from a dark field. The composition feels suspended between an underwater scene and a small theater of appearances.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","citation":"Paul Klee, Fish Magic, 1925. Oil and watercolor on canvas on panel. Philadelphia Museum of Art. https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","dimensions":"77.2 × 98.4 cm","collection":"Philadelphia Museum of Art","artistId":"klee","artistName":"Paul Klee","type":"painting","category":"Paintings","creator":"Paul Klee","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Paul_Klee%2C_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg","originalImageUrl":"./art-city/artworks/klee_fish-magic.webp"},{"id":"painting:castle-and-sun","title":"Castle and Sun","date":"1928","medium":"Oil on canvas","imageUrl":"./city-source-assets/art-city/artworks/klee_castle-and-sun.webp","alt":"Castle and Sun. A town is built from warm rectangles, triangles, and a single bright circle.","description":"A town is built from warm rectangles, triangles, and a single bright circle. Color, not perspective, gives the structures their depth.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","citation":"Paul Klee, Castle and Sun, 1928. Oil on canvas. See source record. https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","dimensions":"50 × 59 cm","collection":"See source record","artistId":"klee","artistName":"Paul Klee","type":"painting","category":"Paintings","creator":"Paul Klee","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Burg_und_Sonne_-_Klee.jpg","originalImageUrl":"./art-city/artworks/klee_castle-and-sun.webp"},{"id":"painting:ancient-sound","title":"Ancient Sound","date":"1925","medium":"Oil on cardboard","imageUrl":"./city-source-assets/art-city/artworks/klee_ancient-sound.webp","alt":"Ancient Sound. A field of small colored squares expands from a darker center.","description":"A field of small colored squares expands from a darker center. The measured grid creates a setting for gradual changes of tone.","sourceUrl":"https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","rights":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","rightsUrl":"https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","citation":"Paul Klee, Ancient Sound, 1925. Oil on cardboard. Kunstmuseum Basel. https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","dimensions":"38.1 × 38.2 cm","collection":"Kunstmuseum Basel","artistId":"klee","artistName":"Paul Klee","type":"painting","category":"Paintings","creator":"Paul Klee","license":"Public-domain artwork; reproduction via Wikimedia Commons. See image record for reuse details.","licenseUrl":"https://commons.wikimedia.org/wiki/File:Alter_Klang%2C_1925_-_Paul_Klee.jpg","originalImageUrl":"./art-city/artworks/klee_ancient-sound.webp"}];
const SOCRATES_STARTER={"rooms":[{"id":"math","name":"Study","purpose":"A quiet study for reading, writing and working through a difficult idea. Keep proofs, plans and questions beside the desk, then explain one clearly to Socrates.","color":"#7871d9","x":0,"y":0,"w":6,"h":5,"floor":0,"brightness":75,"entryText":"","paintings":["composition-eight"]},{"id":"art","name":"Bedroom","purpose":"Your bedroom is a place to rest and keep personal thoughts, dreams and sketches. Return to an idea after a pause and notice what you see differently.","color":"#df795b","x":6,"y":0,"w":6,"h":5,"floor":0,"brightness":75,"entryText":"","paintings":["starry-night"]},{"id":"work","name":"Kitchen","purpose":"The kitchen is for making something useful, sharing daily plans and testing small experiments. Keep recipes, practical projects and their results where you can try them again.","color":"#457ca9","x":12,"y":0,"w":6,"h":5,"floor":0,"brightness":75,"entryText":"","paintings":[]},{"id":"questions","name":"Living room","purpose":"Sit in the living room with Socrates to talk through an open question. Keep different viewpoints here, ask for reasons and leave room for an answer to change.","color":"#be9750","x":0,"y":5,"w":6,"h":5,"floor":0,"brightness":75,"entryText":"","paintings":["water-lilies"]},{"id":"learning","name":"Entrance hall","purpose":"Arrive through the entrance hall, orient yourself and decide what to explore today. Leave a reminder of what you learned and review yesterday’s suggestion before settling in.","color":"#428d83","x":6,"y":5,"w":6,"h":5,"floor":0,"brightness":75,"entryText":"Welcome home. Socrates is in the living room; the house guide shows every room and its objects.","paintings":[]},{"id":"connections","name":"Library","purpose":"The library holds books and ideas worth revisiting. Follow a connection between notes from different rooms, compare their assumptions and remember where each discovery belongs.","color":"#a26b96","x":12,"y":5,"w":6,"h":5,"floor":0,"brightness":75,"entryText":"","paintings":[]}],"doors":[{"a":"math","b":"art"},{"a":"art","b":"work"},{"a":"math","b":"questions"},{"a":"art","b":"learning"},{"a":"work","b":"connections"},{"a":"questions","b":"learning"},{"a":"learning","b":"connections"}],"ideas":[],"residence":{"version":1,"floors":1},"stairs":[]};
const GLB_OBJECTS=STORE_OBJECTS.filter(item=>item.type==='model');
function assertThree(T){if(T!==THREE)throw Error('Use the gallery’s existing global THREE instance.');}
function assetUrl(path,options={}){
 const key=String(path).replace(/^\.\//,'');
 const resolved=options.assetUrl?.(path) || g.CITY_EMBEDDED_ASSETS?.[path] || g.CITY_EMBEDDED_ASSETS?.[key] || g.CITY_EMBEDDED_ASSETS?.['./'+key] || path;
 if(typeof resolved!=='string')throw Error('Asset resolver must return a URL string.');
 if(/^(?:data:|blob:)/i.test(resolved))return resolved;
 if(/^(?:https?:)?\/\//i.test(resolved)){
  if(!g.location||new URL(resolved,g.location.href).origin!==g.location.origin)throw Error('Only bundled or same-origin source assets are loaded.');
 }
 return resolved;
}
function sharedEdge(a,b){
 if((a.floor??0)!==(b.floor??0))return null;
 const lowX=Math.max(a.x,b.x),highX=Math.min(a.x+a.w,b.x+b.w),lowY=Math.max(a.y,b.y),highY=Math.min(a.y+a.h,b.y+b.h);
 if(highY-lowY>=2&&(a.x+a.w===b.x||b.x+b.w===a.x))return {axis:'z',fixed:a.x+a.w===b.x?b.x:a.x,lo:lowY,hi:highY};
 if(highX-lowX>=2&&(a.y+a.h===b.y||b.y+b.h===a.y))return {axis:'x',fixed:a.y+a.h===b.y?b.y:a.y,lo:lowX,hi:highX};
 return null;
}

const centerOf=r=>({x:r.x+r.w/2-10,z:r.y+r.h/2-8,roomId:r.id});
function houseBounds(house){const minX=Math.min(...house.rooms.map(r=>r.x))-10,maxX=Math.max(...house.rooms.map(r=>r.x+r.w))-10,minZ=Math.min(...house.rooms.map(r=>r.y))-8,maxZ=Math.max(...house.rooms.map(r=>r.y+r.h))-8;return {minX,maxX,minZ,maxZ,w:maxX-minX,d:maxZ-minZ,cx:(minX+maxX)/2,cz:(minZ+maxZ)/2};}
function entranceFor(house){const ground=house.rooms.filter(room=>(room.floor??0)===0),rooms=ground.length?ground:house.rooms,b=houseBounds({...house,rooms}),room=rooms.filter(r=>r.y+r.h-8===b.maxZ).sort((a,c)=>Math.abs(centerOf(a).x-b.cx)-Math.abs(centerOf(c).x-b.cx))[0];return {roomId:room.id,x:centerOf(room).x,z:b.maxZ,width:1.5};}
function roomAtPoint(house,x,z,padding=0){return house.rooms.find(r=>x+10>=r.x+padding&&x+10<=r.x+r.w-padding&&z+8>=r.y+padding&&z+8<=r.y+r.h-padding)?.id||null;}
function reachableIds(house,start){const seen=new Set([start]),queue=[start];while(queue.length){const id=queue.shift();for(const d of house.doors){const next=d.a===id?d.b:d.b===id?d.a:null;if(next&&!seen.has(next)){seen.add(next);queue.push(next);}}}return [...seen];}
function roomRoute(house,start,end){
 if(start===end)return [start];const parents=new Map([[start,null]]),queue=[start];
 while(queue.length){const id=queue.shift();for(const d of house.doors){const next=d.a===id?d.b:d.b===id?d.a:null;if(!next||parents.has(next))continue;parents.set(next,id);if(next===end){const route=[end];while(parents.get(route[0])!==null)route.unshift(parents.get(route[0]));return route;}queue.push(next);}}
 return [];
}
function walkingRoute(house,start,roomId,target){
 const destination=house.rooms.find(r=>r.id===roomId);if(!destination)return [];
 const entrance=entranceFor(house),startRoom=roomAtPoint(house,start.x,start.z)||entrance.roomId,route=roomRoute(house,startRoom,roomId);if(!route.length)return [];
 const points=[];if(!roomAtPoint(house,start.x,start.z)){points.push({x:entrance.x,z:entrance.z+1.1,roomId:null},{x:entrance.x,z:entrance.z-.55,roomId:entrance.roomId});}
 for(let n=0;n<route.length;n++){
  const room=house.rooms.find(r=>r.id===route[n]);points.push(centerOf(room));if(n===route.length-1)continue;
  const next=house.rooms.find(r=>r.id===route[n+1]),edge=sharedEdge(room,next),mid=(edge.lo+edge.hi)/2;
  points.push({x:edge.axis==='x'?mid-10:edge.fixed-10,z:edge.axis==='z'?mid-8:edge.fixed-8,roomId:next.id,door:true});
 }
 if(target)points.push({x:target.x,z:target.z,roomId});return points;
}
function yardBounds(house){const b=houseBounds(house);return {minX:b.minX-8,maxX:b.maxX+8,minZ:b.minZ-5,maxZ:b.maxZ+14};}
function canExploreAt(house,walls,x,z,radius=.2){const b=yardBounds(house);if(x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ)return false;return !walls.some(w=>{const dist=w.axis==='x'?Math.abs(z+8-w.fixed):Math.abs(x+10-w.fixed),along=w.axis==='x'?x+10:z+8;return dist<radius&&along>w.lo-radius&&along<w.hi+radius;});}
// Furniture has a footprint: both residents and players use the same solid space.
function canOccupy(obstacles,x,z,radius=.2){return !obstacles.some(o=>x>o.minX-radius&&x<o.maxX+radius&&z>o.minZ-radius&&z<o.maxZ+radius);}
// Advance one small frame along already validated doorway waypoints.
function stepAlongPath(position,path,distance,canStand=()=>true){
 let remaining=distance,moved=0,heading=null;
 while(path.length&&remaining>0){const next=path[0],dx=next.x-position.x,dz=next.z-position.z,length=Math.hypot(dx,dz);if(length<.025){position.x=next.x;position.z=next.z;path.shift();continue;}
  const step=Math.min(remaining,length),nx=position.x+dx/length*step,nz=position.z+dz/length*step;if(!canStand(nx,nz))break;position.x=nx;position.z=nz;heading=Math.atan2(-dx,-dz);moved+=step;remaining-=step;if(step>=length-.001)path.shift();
 }return {moved,heading,finished:path.length===0};
}
// A bounded yard/doorway search is used only when entering from an arbitrary
// outdoor position. Residents use the smaller, explicit room-and-door graph.
function findWalkingPath(house,walls,start,target,spacing=.35,passable=null){
 const b=yardBounds(house),cols=Math.ceil((b.maxX-b.minX)/spacing),rows=Math.ceil((b.maxZ-b.minZ)/spacing),key=(x,z)=>z*cols+x;
 const cell=p=>({x:Math.max(0,Math.min(cols-1,Math.round((p.x-b.minX)/spacing))),z:Math.max(0,Math.min(rows-1,Math.round((p.z-b.minZ)/spacing)))}),world=p=>({x:b.minX+p.x*spacing,z:b.minZ+p.z*spacing});
 const from=cell(start),to=cell(target),queue=[from],parents=new Map([[key(from.x,from.z),null]]);let reached=false;
 for(let n=0;n<queue.length;n++){const current=queue[n];if(current.x===to.x&&current.z===to.z){reached=true;break;}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const next={x:current.x+dx,z:current.z+dz},id=key(next.x,next.z);if(next.x<0||next.x>=cols||next.z<0||next.z>=rows||parents.has(id))continue;const p=world(next);if(!canExploreAt(house,walls,p.x,p.z,.22)||(passable&&!passable(p.x,p.z)))continue;parents.set(id,current);queue.push(next);}}
 if(!reached)return [];const route=[],cursor={...to};let prev;while((prev=parents.get(key(cursor.x,cursor.z)))!==null){route.unshift(world(cursor));cursor.x=prev.x;cursor.z=prev.z;}
 // Keep only turns to avoid a stop at every grid cell.
 const turns=[];for(let n=0;n<route.length;n++){if(n===route.length-1||n===0||Math.abs((route[n].x-route[n-1].x)*(route[n+1].z-route[n].z)-(route[n].z-route[n-1].z)*(route[n+1].x-route[n].x))>.001)turns.push(route[n]);}turns.push({x:target.x,z:target.z});return turns;
}

// A crowded collection belongs on wall shelves, leaving the room habitable.
function ideaDisplays(house,room){
 const ideas=house.ideas.filter(i=>i.roomId===room.id),left=room.x-10,top=room.y-8,dense=ideas.length>(Math.min(room.w,room.h)<4?3:6);
 if(!dense){const cols=Math.min(3,Math.max(1,Math.ceil(Math.sqrt(ideas.length*room.w/room.h)))),rows=Math.ceil(ideas.length/cols);return {dense:false,cabinets:[],slots:ideas.map((idea,index)=>({idea,x:left+(.5+index%cols)/cols*room.w,z:top+1.4+(.5+Math.floor(index/cols))/Math.max(1,rows)*(room.h-2.15),y:.93,scale:1,pedestal:true}))};}
 const doors=[];for(const d of house.doors){if(d.a!==room.id&&d.b!==room.id)continue;const other=house.rooms.find(r=>r.id===(d.a===room.id?d.b:d.a)),e=other&&sharedEdge(room,other);if(e){const c=(e.lo+e.hi)/2;doors.push(e.axis==='x'?{minX:c-10-.86,maxX:c-10+.86,minZ:e.fixed-8-.45,maxZ:e.fixed-8+.45}:{minX:e.fixed-10-.45,maxX:e.fixed-10+.45,minZ:c-8-.86,maxZ:c-8+.86});}}
 const entry=entranceFor(house);if(entry.roomId===room.id)doors.push({minX:entry.x-.86,maxX:entry.x+.86,minZ:entry.z-.45,maxZ:entry.z+.45});
 const overlap=(a,b,pad=0)=>a.minX<b.maxX+pad&&a.maxX>b.minX-pad&&a.minZ<b.maxZ+pad&&a.maxZ>b.minZ-pad,points=[{x:left+.45,z:top+.34,yaw:0},{x:left+room.w-.45,z:top+.34,yaw:0},{x:left+.45,z:top+room.h-.34,yaw:Math.PI},{x:left+room.w-.45,z:top+room.h-.34,yaw:Math.PI}];
 for(let x=left+.45;x<=left+room.w-.45;x+=.26)points.push({x,z:top+.34,yaw:0},{x,z:top+room.h-.34,yaw:Math.PI});for(let z=top+.45;z<=top+room.h-.45;z+=.26)points.push({x:left+.34,z,yaw:Math.PI/2},{x:left+room.w-.34,z,yaw:-Math.PI/2});
 const cabinets=[];for(const c of points){const turned=Math.abs(Math.sin(c.yaw))>.5,hx=turned?.21:.26,hz=turned?.26:.21,candidate={...c,width:.48,depth:.38,minX:c.x-hx,maxX:c.x+hx,minZ:c.z-hz,maxZ:c.z+hz};if(doors.some(d=>overlap(candidate,d))||cabinets.some(d=>overlap(candidate,d,.12)))continue;cabinets.push(candidate);if(cabinets.length===4)break;}
 // Twelve ideas still remain selectable if an unusual tiny layout has fewer
 // wall segments: the display grows vertically instead of occupying a route.
 const count=Math.max(1,cabinets.length),levels=Math.ceil(ideas.length/count),step=Math.min(.62,1.55/Math.max(1,levels-1)),scale=Math.min(.48,step/.94),slots=ideas.map((idea,index)=>{const cabinet=cabinets[index%count]||{x:left+.45,z:top+.34,yaw:0},level=Math.floor(index/count),shelf=.55+level*step,radius={book:.065,sphere:.34,crystal:.43,ring:.415}[idea.cue]||.34;return {idea,x:cabinet.x+Math.sin(cabinet.yaw)*.015,z:cabinet.z+Math.cos(cabinet.yaw)*.015,y:shelf+radius*scale+.041,shelf,scale,pedestal:false,cabinet:index%count};});
 return {dense:true,cabinets,slots};
}

// Original short readings for the offline house; these are not quotations from Socrates.
const BOOKS=[
 {id:'definitions',title:'What do we mean?',pages:[
  'A useful conversation starts by making a word clear. If you call a house comfortable, which experiences count: warmth, quiet, company, freedom to move? A definition gives you something both people can examine.',
  'Try your definition on two different examples. A crowded kitchen might feel comfortable with friends and uncomfortable while you work. Let the example refine the definition rather than defending the first answer.'],question:'Choose one word you use often. Define it, then give an example that challenges your definition.'},
 {id:'assumptions',title:'The hidden premise',pages:[
  'An argument often carries a premise it never says aloud. “More books will make this a better library” assumes that quantity improves learning. Perhaps access, light or time to read matters more.',
  'Write the claim and the reason separately. Ask what would have to be true for the reason to support the claim. You can test that hidden premise without dismissing the whole idea.'],question:'Which hidden assumption supports one of your ideas? How could you test it?'},
 {id:'counterexamples',title:'The difficult example',pages:[
  'A counterexample is an invitation to make a claim more precise. “Quiet rooms are always best for thinking” becomes doubtful when a conversation helps solve a problem.',
  'Choose a case where your rule might fail. If it fails, narrow the rule or explain the exception. Learning can mean replacing a confident generalisation with a smaller, stronger claim.'],question:'Find a case where a rule you believe might fail. What would you change about the rule?'},
 {id:'care',title:'Making a place to live',pages:[
  'A place supports a life through ordinary things: somewhere to put a coat, a cup within reach, a chair where two people can talk. The purpose of a room is visible in what it lets you do.',
  'Walk through this house and notice one friction. Does the path interrupt a conversation? Is a book hard to find? Start with a small change that improves an actual daily experience.'],question:'What is one small change that would make this house easier to inhabit?'},
 {id:'practice',title:'Learning by trying',pages:[
  'An idea becomes clearer when it meets a small test. State what you expect to happen, choose an action you can repeat, and observe what happens. An unexpected result is useful evidence.',
  'Keep prediction and observation separate in your notes. One trial rarely decides everything. Ask what alternative explanation fits the result and what you would try next.'],question:'Describe a small experiment: your prediction, what you will observe, and what would change your mind.'},
 {id:'dialogue',title:'Thinking together',pages:[
  'A dialogue needs room for both people to revise their view. Before you challenge a claim, try to describe it in words the other person would recognise. A fair summary makes disagreement more useful.',
  'Ask for reasons, offer an example and listen for a distinction you missed. You do not need to agree at the end. A better question can be a worthwhile result of the conversation.'],question:'What is a fair account of a view you disagree with? What question would help you understand it?'}
];
const bookById=id=>BOOKS.find(book=>book.id===id)||BOOKS[0];

// Domestic furnishings in metres. No DOM, textures, network, or saved-state edits.
const HOME_ROLES = {math:'study',art:'bedroom',work:'kitchen',questions:'living room',learning:'entrance hall',connections:'library'};
const HOME_BOOKS = Object.fromEntries(BOOKS.map(({id,title})=>[id,title]));
const bookIds=Object.keys(HOME_BOOKS);
const overlap=(a,b,pad=0)=>a.minX<b.maxX+pad&&a.maxX>b.minX-pad&&a.minZ<b.maxZ+pad&&a.maxZ>b.minZ-pad;

function kit(T){
 const books=[],lights=[];let bookSequence=0;
 const material=(color,roughness=.76,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const m={oak:material('#a27c53'),walnut:material('#6b4d36'),cream:material('#eee4d3'),linen:material('#d5c8b3'),sage:material('#889080'),rose:material('#b99283'),ink:material('#3d4545'),metal:material('#9fa7a4',.27,.65),white:material('#e9e7de'),glass:material('#273337',.17,.12),leaf:material('#52745b'),terra:material('#a46d51'),paper:material('#f2ead8'),blue:material('#677d8a'),gold:material('#b69a60',.38,.4)};
 const box=(g,w,h,d,x,y,z,mat)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const cyl=(g,r,h,x,y,z,mat,top=r)=>{const o=new T.Mesh(new T.CylinderGeometry(top,r,h,20),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const ball=(g,r,x,y,z,mat,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(new T.SphereGeometry(r,20,12),mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o;};
 const ring=(g,r,t,x,y,z,mat,flat=false)=>{const o=new T.Mesh(new T.TorusGeometry(r,t,8,24),mat);o.position.set(x,y,z);if(flat)o.rotation.x=Math.PI/2;g.add(o);return o;};
 const trackBook=(root,node,x,y,z)=>{const bookId=bookIds[bookSequence%bookIds.length];books.push({root,node,bookId,instance:bookSequence++,target:new T.Vector3(x,y,z)});node.userData.bookId=bookId;return node;};
 const book=(g,x,y,z,w=.24,d=.32,color=m.sage)=>{const n=new T.Group();g.add(n);box(n,w,.045,d,x,y,z,color);box(n,w-.015,.025,d-.02,x,y+.004,z,m.paper);box(n,w,.008,d,x,y+.022,z,color);for(let i=0;i<3;i++)box(n,w-.02,.002,d-.03,x,y-.009+i*.007,z,m.linen);box(n,.015,.048,d,x-w/2+.009,y,z,m.walnut);for(let i=0;i<3;i++)box(n,.02,.004,.007,x-w/2+.017,y+.025,z-d*.3+i*d*.3,m.gold);return trackBook(g,n,x,y,z);};
 const cup=(g,x,y,z)=>{const n=new T.Group();g.add(n);cyl(n,.065,.012,x,y,z,m.white);cyl(n,.047,.085,x,y+.05,z,m.cream,.055);cyl(n,.046,.004,x,y+.094,z,m.walnut);ring(n,.052,.008,x,y+.094,z,m.white,true);ring(n,.029,.009,x+.069,y+.053,z,m.cream);return n;};
 const lamp=(g,x,y,z)=>{const n=new T.Group();g.add(n);cyl(n,.13,.025,x,y+.012,z,m.metal);cyl(n,.015,.45,x,y+.24,z,m.gold);cyl(n,.18,.22,x,y+.54,z,m.cream,.095);const bulb=ball(n,.042,x,y+.47,z,new T.MeshStandardMaterial({color:'#f6dbaa',emissive:'#d6a76e',emissiveIntensity:.35}));bulb.userData.homeBulb=true;const light=new T.PointLight('#ffdda9',1.6,3,2);light.position.set(x,y+.47,z);n.add(light);n.userData.homeLampOn=true;lights.push({root:g,node:n,target:new T.Vector3(x,y+.54,z)});return n;};
 const plant=(g,x,y,z,scale=1)=>{cyl(g,.15*scale,.24*scale,x,y+.12*scale,z,m.terra,.18*scale);cyl(g,.175*scale,.012,x,y+.243*scale,z,m.walnut);for(let i=0;i<5;i++){const a=i*2.4;ball(g,.15*scale,x+Math.cos(a)*.12*scale,y+.36*scale+(i%2)*.12*scale,z+Math.sin(a)*.1*scale,m.leaf,.62,1.5,.85);}};
 const chair=(g,x,z,fabric=m.sage)=>{const n=new T.Group();g.add(n);box(n,.48,.1,.48,x,.47,z,fabric);box(n,.47,.4,.09,x,.71,z-.2,fabric);for(const dx of [-.18,.18])for(const dz of [-.18,.18])cyl(n,.025,.43,x+dx,.215,z+dz,m.walnut);box(n,.48,.025,.025,x,.485,z+.247,m.linen);return n;};
 return {T,m,box,cyl,ball,ring,book,cup,lamp,plant,chair,books,lights,trackBook};
}

function prototype(k,kind,compact=false){
 const {T,m,box,cyl,ball,ring,book,cup,lamp,plant,chair}=k,g=new T.Group(),actions=[];
 const action=(node,type,label,x=0,y=.8,z=0)=>actions.push({node,type,label,target:new T.Vector3(x,y,z)});
 if(kind==='desk'){
  const w=compact?1.05:1.5;box(g,w,.055,.65,0,.76,0,m.oak);for(const dx of [-w/2+.08,w/2-.08])for(const dz of [-.24,.24])box(g,.055,.72,.055,dx,.36,dz,m.walnut);
  box(g,.39,.24,.56,w/2-.24,.59,0,m.oak);for(const y of [.52,.64]){box(g,.35,.095,.018,w/2-.24,y,.29,m.linen);box(g,.12,.014,.027,w/2-.24,y,.308,m.gold);}
  const journal=book(g,-.17,.81,.03,.27,.34,m.blue);action(journal,'journal','Write at the study desk',-.17,.84,.03);
  const reading=book(g,.17,.82,-.13,.19,.26,m.walnut);action(reading,'read','Read the book on the desk',.17,.85,-.13);lamp(g,-w/2+.2,.8,-.14);
  cyl(g,.034,.11,w/2-.16,.86,.08,m.ink);for(let i=0;i<3;i++){const pen=cyl(g,.006,.18,w/2-.17+i*.015,.93,.08,m.oak);pen.rotation.z=(i-1)*.13;}
 }else if(kind==='armchair'){
  box(g,.7,.18,.66,0,.43,0,m.sage);box(g,.68,.56,.16,0,.75,-.25,m.sage);for(const x of [-.32,.32]){box(g,.14,.28,.67,x,.64,0,m.sage);box(g,.105,.11,.66,x,.82,0,m.linen);}for(const x of [-.26,.26])for(const z of [-.23,.23])box(g,.055,.25,.055,x,.125,z,m.walnut);
  box(g,.48,.026,.47,0,.54,.035,m.linen);box(g,.36,.24,.1,0,.73,-.15,m.rose);action(g,'sit','Sit in the reading chair',0,.65,.12);
 }else if(kind==='bed'){
  const w=compact?.92:1.42,d=compact?1.8:2.06;box(g,w,.22,d,0,.24,0,m.oak);for(const x of [-w/2+.07,w/2-.07])for(const z of [-d/2+.09,d/2-.09])box(g,.08,.14,.08,x,.07,z,m.walnut);
  box(g,w-.07,.2,d-.07,0,.45,0,m.cream);box(g,w+.025,.85,.095,0,.57,-d/2,m.walnut);box(g,w-.11,.55,.035,0,.64,-d/2+.065,m.linen);
  box(g,w-.055,.07,d*.66,0,.585,d*.15,m.blue);for(const x of [-w*.21,w*.21])ball(g,.2,x,.64,-d*.31,m.paper,1.25,.35,.7);box(g,w-.06,.026,.16,0,.632,-d*.16,m.linen);
  for(let n=0;n<5;n++)box(g,.018,.004,d*.6,-w*.38+n*w*.19,.623,d*.14,m.sage);
  action(g,'rest','Rest beside the bedroom bed',0,.67,.1);const b=book(g,w*.29,.665,d*.3,.2,.27,m.rose);action(b,'read','Read the bedtime book',w*.29,.69,d*.3);
 }else if(kind==='nightstand'){
  box(g,.44,.56,.41,0,.28,0,m.oak);box(g,.39,.18,.025,0,.37,.221,m.linen);ball(g,.025,0,.37,.244,m.gold);box(g,.47,.035,.45,0,.575,0,m.walnut);lamp(g,-.07,.61,-.04);const c=cup(g,.115,.61,.1);action(c,'tea','Have a quiet evening tea',.115,.7,.1);
 }else if(kind==='wardrobe'){
  const w=compact?.64:1.05;box(g,w,1.97,.48,0,1.02,0,m.oak);for(const x of [-w*.25,w*.25]){box(g,w*.46,1.81,.025,x,1.04,.258,m.linen);cyl(g,.012,.14,x+(x<0?.08:-.08),1.02,.286,m.gold);}box(g,w+.04,.05,.53,0,2.02,0,m.walnut);box(g,w-.1,.1,.39,0,.05,0,m.walnut);
 }else if(kind==='counter'){
  const w=compact?1.32:1.9;box(g,w,.79,.61,0,.415,0,m.white);box(g,w+.035,.047,.67,0,.835,0,m.linen);box(g,w,.06,.51,0,.04,0,m.ink);
  for(let i=0;i<3;i++){const x=-w/2+w*(i+.5)/3;box(g,w/3-.035,.64,.021,x,.44,.32,m.cream);box(g,.11,.015,.028,x,.66,.343,m.metal);}box(g,w,.33,.055,0,1.01,-.31,m.cream);
  const sinkX=-w*.26;box(g,.38,.012,.37,sinkX,.864,0,m.metal);box(g,.31,.014,.28,sinkX,.873,0,m.ink);for(const dx of [-.17,.17])box(g,.025,.043,.31,sinkX+dx,.875,0,m.metal);
  const curve=new T.CatmullRomCurve3([new T.Vector3(sinkX,.88,-.18),new T.Vector3(sinkX,1.16,-.18),new T.Vector3(sinkX,1.18,-.02),new T.Vector3(sinkX,1.08,.03)]);g.add(new T.Mesh(new T.TubeGeometry(curve,20,.015,8,false),m.metal));
  const stoveX=w*.26;box(g,.46,.015,.42,stoveX,.868,0,m.glass);for(const x of [-.12,.12])for(const z of [-.1,.1])ring(g,.073,.009,stoveX+x,.882,z,m.metal,true);
  box(g,.42,.36,.025,stoveX,.48,.337,m.glass);box(g,.31,.025,.035,stoveX,.69,.363,m.metal);for(let i=0;i<3;i++)ball(g,.017,stoveX-.12+i*.12,.75,.347,m.metal);
  const c=cup(g,-.05,.868,.12);action(c,'tea','Make tea at the kitchen counter',-.05,.97,.12);const b=book(g,stoveX,.904,-.12,.17,.22,m.rose);action(b,'read','Read the kitchen recipe',stoveX,.93,-.12);
 }else if(kind==='fridge'){
  box(g,.59,1.77,.6,0,.92,0,m.white);box(g,.56,.42,.032,0,1.54,.321,m.cream);box(g,.56,1.17,.032,0,.715,.321,m.cream);box(g,.025,.2,.045,.225,1.5,.36,m.metal);box(g,.025,.43,.045,.225,.91,.36,m.metal);for(let i=0;i<2;i++)box(g,.09,.08,.006,-.13+i*.19,1.32,.342,i?m.rose:m.sage);
 }else if(kind==='dining'){
  const w=compact?.7:1.0;box(g,w,.06,.65,0,.74,0,m.oak);for(const x of [-w/2+.07,w/2-.07])for(const z of [-.23,.23])box(g,.045,.71,.045,x,.355,z,m.walnut);
  const ch=chair(g,0,.63,m.linen);action(ch,'sit','Sit at the kitchen table',0,.62,.64);const c=cup(g,.16,.783,.1);action(c,'tea','Drink tea at the kitchen table',.16,.87,.1);cyl(g,.12,.009,-.19,.781,-.02,m.paper);box(g,.026,.008,.24,-.36,.784,-.02,m.metal);
 }else if(kind==='sofa'){
  const w=compact?1.12:2.15;box(g,w,.29,.79,0,.39,0,m.sage);box(g,w,.52,.17,0,.69,-.31,m.sage);for(const x of [-w/2+.09,w/2-.09]){box(g,.2,.28,.82,x,.61,0,m.sage);box(g,.17,.04,.76,x,.77,.025,m.linen);}for(const x of [-w/2+.18,w/2-.18])for(const z of [-.25,.25])box(g,.055,.25,.055,x,.125,z,m.walnut);
  const seats=compact?2:3;for(let i=0;i<seats;i++){const x=-w*.39+w*.78*(i+.5)/seats;box(g,w*.76/seats-.018,.1,.55,x,.585,.065,m.linen);}for(const x of [-w*.29,w*.29])ball(g,.18,x,.76,-.125,m.rose,1,.85,.32);action(g,'sit','Sit on the living-room sofa',0,.67,.16);
 }else if(kind==='coffee'){
  const w=compact?.62:1.12;box(g,w,.07,.57,0,.39,0,m.walnut);for(const x of [-w/2+.07,w/2-.07])for(const z of [-.2,.2])box(g,.055,.36,.055,x,.18,z,m.oak);box(g,w-.16,.04,.4,0,.11,0,m.oak);
  const c=cup(g,w*.24,.437,.08);action(c,'tea','Have tea in the living room',w*.24,.52,.08);const b=book(g,-w*.18,.445,-.015,.22,.29,m.blue);action(b,'read','Read beside the sofa',-w*.18,.48,-.015);
 }else if(kind==='fireplace'){
  const w=compact?.76:1.25;box(g,w,1.09,.24,0,.55,0,m.cream);box(g,w*.7,.64,.045,0,.42,.143,m.ink);box(g,w+.09,.07,.36,0,1.12,.03,m.oak);box(g,w+.05,.045,.48,0,.03,.06,m.linen);
  for(let i=0;i<3;i++){const log=cyl(g,.047,w*.4,0,.12+i*.055,.18,m.walnut);log.rotation.z=Math.PI/2;}for(let i=0;i<3;i++)ball(g,.066,-.15+i*.15,.24+(i%2)*.1,.17,new T.MeshStandardMaterial({color:'#c08b53',emissive:'#a85826',emissiveIntensity:.32}),.5,1.6,.4);action(g,'rest','Rest by the living-room fireplace',0,.55,.17);
 }else if(kind==='bookshelf'){
  const w=compact?.68:1.18;box(g,w,1.85,.035,0,.95,-.13,m.walnut);for(const x of [-w/2,w/2])box(g,.047,1.9,.35,x,.97,0,m.oak);const colors=[m.blue,m.rose,m.sage,m.cream,m.oak];let readable;
  for(const y of [.32,.78,1.24,1.7]){box(g,w,.038,.37,0,y,.018,m.oak);for(let i=0;i<Math.floor(w/.115)-1;i++){const x=-w/2+.09+i*.115,h=.24+(i%3)*.035,n=new T.Group();g.add(n);const b=box(n,.077,h,.24,x,y+h/2+.02,.052,colors[i%colors.length]);box(n,.059,.009,.01,x,y+h*.62,.178,m.gold);for(const dy of [.06,h-.035])box(n,.071,.009,.012,x,y+dy,.176,m.walnut);box(n,.008,h-.018,.225,x+.033,y+h/2+.02,.052,m.paper);k.trackBook(g,n,x,y+h/2+.02,.052);if(!readable&&y===.78)readable=n;}}
  action(readable||g,'read','Read a book from the library',0,1.04,.1);
 }else if(kind==='console'){
  const w=compact?.67:1.13;box(g,w,.047,.39,0,.8,0,m.walnut);for(const x of [-w/2+.06,w/2-.06])box(g,.045,.78,.33,x,.39,0,m.oak);box(g,w-.1,.06,.32,0,.19,0,m.oak);
  const j=book(g,-w*.21,.842,.035,.22,.29,m.blue);action(j,'journal','Write in the hall journal',-w*.21,.86,.035);const b=book(g,w*.19,.87,-.02,.18,.25,m.sage);action(b,'read','Read the note by the entrance',w*.19,.9,-.02);cyl(g,.095,.014,w*.32,.84,.04,m.gold);ball(g,.023,w*.32,.863,.04,m.ink);
 }else if(kind==='bench'){
  const w=compact?.63:1.15;box(g,w,.105,.4,0,.47,0,m.oak);box(g,w-.055,.065,.365,0,.55,0,m.linen);for(const x of [-w/2+.05,w/2-.05])for(const z of [-.13,.13])box(g,.045,.43,.045,x,.215,z,m.walnut);
  for(const x of [-w*.18,w*.18])box(g,.17,.085,.27,x,.125,.01,m.ink);action(g,'sit','Sit on the entrance bench',0,.62,.06);
 }else if(kind==='coat'){
  cyl(g,.18,.045,0,.03,0,m.walnut);cyl(g,.035,1.63,0,.86,0,m.oak);for(let i=0;i<3;i++){const a=i*2.1;const arm=cyl(g,.015,.24,Math.cos(a)*.085,1.56,Math.sin(a)*.085,m.oak);arm.rotation.z=Math.sin(a)*.85;box(g,.18,.49,.07,Math.cos(a)*.12,1.25,Math.sin(a)*.12,i?m.sage:m.rose);}
 }else if(kind==='side'){
  cyl(g,.26,.045,0,.57,0,m.oak);cyl(g,.042,.53,0,.285,0,m.walnut);cyl(g,.2,.035,0,.025,0,m.walnut);const c=cup(g,.08,.611,.04);action(c,'tea','Have tea by the reading chair',.08,.7,.04);const b=book(g,-.065,.62,-.025,.17,.23,m.rose);action(b,'journal','Note what your reading changed',-.065,.66,-.025);
 }else if(kind==='globe'){
  cyl(g,.21,.025,0,.035,0,m.walnut);cyl(g,.035,.42,0,.25,0,m.gold);const earth=ball(g,.205,0,.66,0,m.blue);ring(g,.24,.012,0,.66,0,m.gold);for(let i=0;i<4;i++)ball(g,.078,Math.sin(i*1.8)*.15,.69+Math.cos(i*2)*.08,Math.cos(i*1.8)*.13,m.sage,.8,.62,.2);action(earth,'read','Explore the library globe',0,.7,0);
 }else if(kind==='plant')plant(g,0,0,0,compact?.68:1);
 else if(kind==='ledge'){
  box(g,.38,.035,.2,0,.8,0,m.oak);box(g,.025,.18,.14,-.14,.7,0,m.walnut);box(g,.025,.18,.14,.14,.7,0,m.walnut);const b=book(g,-.07,.836,0,.16,.2,m.blue);action(b,'read','Read in this quiet corner',-.07,.86,0);const c=cup(g,.105,.837,.012);action(c,'tea','Pause for tea in this room',.105,.92,.012);
 }
 g.name=`home-${kind}`;return {group:g,actions,kind};
}

function reservedAreas(house,r){
 const out=[],cx=r.w/2,cz=r.h/2,routeHalf=.43;
 const addDoor=(axis,c,fixed)=>{
  if(axis==='x'){out.push({minX:c-.93,maxX:c+.93,minZ:fixed-.57,maxZ:fixed+.57,kind:'door'});out.push({minX:Math.min(c,cx)-routeHalf,maxX:Math.max(c,cx)+routeHalf,minZ:Math.min(fixed,cz)-routeHalf,maxZ:Math.max(fixed,cz)+routeHalf,kind:'route'});}
  else{out.push({minX:fixed-.57,maxX:fixed+.57,minZ:c-.93,maxZ:c+.93,kind:'door'});out.push({minX:Math.min(fixed,cx)-routeHalf,maxX:Math.max(fixed,cx)+routeHalf,minZ:Math.min(c,cz)-routeHalf,maxZ:Math.max(c,cz)+routeHalf,kind:'route'});}
 };
 for(const d of house.doors||[]){if(d.a!==r.id&&d.b!==r.id)continue;const other=house.rooms.find(room=>room.id===(d.a===r.id?d.b:d.a)),edge=other&&sharedEdge(r,other);if(edge)addDoor(edge.axis,(edge.lo+edge.hi)/2-(edge.axis==='x'?r.x:r.y),edge.fixed-(edge.axis==='x'?r.y:r.x));}
 const entry=entranceFor(house);if(entry.roomId===r.id)addDoor('x',entry.x+10-r.x,entry.z+8-r.y);
 out.push({minX:cx-.46,maxX:cx+.46,minZ:cz-.46,maxZ:cz+.46,kind:'center'});
 const display=ideaDisplays(house,r),left=r.x-10,top=r.y-8;
 for(const area of house.residenceKeepouts||[])if(area.roomId===r.id)out.push({...area,minX:area.minX-left,maxX:area.maxX-left,minZ:area.minZ-top,maxZ:area.maxZ-top,kind:'idea'});
 if(display.dense)for(const b of display.cabinets)out.push({minX:b.minX-left,maxX:b.maxX-left,minZ:b.minZ-top,maxZ:b.maxZ-top,kind:'idea'});
 else for(const slot of display.slots)out.push({minX:slot.x-left-.39,maxX:slot.x-left+.39,minZ:slot.z-top-.39,maxZ:slot.z-top+.39,kind:'idea'});
 return out;
}

function place(T,p,r,reserved,occupied){
 p.group.updateMatrixWorld(true);const box=new T.Box3().setFromObject(p.group),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 const rotations=[0,Math.PI/2,Math.PI,-Math.PI/2];let best;
 for(const yaw of rotations){const turn=Math.abs(Math.sin(yaw))>.5,w=turn?size.z:size.x,d=turn?size.x:size.z,hw=w/2,hd=d/2;if(w>r.w-.2||d>r.h-.2)continue;
  const xs=[.12+hw,r.w-.12-hw],zs=[.12+hd,r.h-.12-hd];for(let x=.12+hw;x<=r.w-.12-hw+.001;x+=.22)xs.push(x);for(let z=.12+hd;z<=r.h-.12-hd+.001;z+=.22)zs.push(z);
  for(const x of xs)for(const z of zs){const b={minX:x-hw,maxX:x+hw,minZ:z-hd,maxZ:z+hd};if(reserved.some(q=>overlap(b,q))||occupied.some(q=>overlap(b,q,.075)))continue;
   const wallDistance=Math.min(b.minX,r.w-b.maxX,b.minZ,r.h-b.maxZ);if(wallDistance>.55)continue;
   const front={x:Math.sin(yaw),z:Math.cos(yaw)},toward={x:r.w/2-x,z:r.h/2-z},face=front.x*toward.x+front.z*toward.z;
   const score=wallDistance*8+(face<0?8:0)+x*.035+z*.017;if(!best||score<best.score)best={x,z,yaw,b,score};
  }
 }
 if(!best)return null;const rotated=center.clone().applyAxisAngle(new T.Vector3(0,1,0),best.yaw);p.group.rotation.y=best.yaw;p.group.position.set(r.x-10+best.x-rotated.x,0,r.y-8+best.z-rotated.z);p.group.updateMatrixWorld(true);return best;
}

function freeAnchor(r,target,obstacles,preferred){
 const left=r.x-10,top=r.y-8,inside=(x,z)=>x>=left+.2&&x<=left+r.w-.2&&z>=top+.2&&z<=top+r.h-.2;
 const free=(x,z)=>inside(x,z)&&!obstacles.some(b=>x>b.minX-.2&&x<b.maxX+.2&&z>b.minZ-.2&&z<b.maxZ+.2);
 const candidates=[];if(preferred)candidates.push(preferred);for(const radius of [.55,.75,1,1.3])for(let i=0;i<16;i++){const a=i*Math.PI/8;candidates.push({x:target.x+Math.sin(a)*radius,z:target.z+Math.cos(a)*radius});}
 candidates.push({x:left+r.w/2,z:top+r.h/2});for(let x=left+.25;x<left+r.w-.2;x+=.2)for(let z=top+.25;z<top+r.h-.2;z+=.2)candidates.push({x,z});
 const choices=candidates.filter(p=>free(p.x,p.z));choices.sort((a,b)=>Math.hypot(a.x-target.x,a.z-target.z)-Math.hypot(b.x-target.x,b.z-target.z));return choices[0]||null;
}

function buildInterior(house,room,THREE,{walk=true}={}){
 if(!room||![room.x,room.y,room.w,room.h].every(Number.isFinite)||room.w<3||room.h<3)throw Error('A domestic interior needs a room at least 3 × 3 metres.');
 const k=kit(THREE),group=new THREE.Group(),obstacles=[],interactions=[],occupied=[],reserved=reservedAreas(house,room),parts=[],compact=Math.min(room.w,room.h)<4,role=HOME_ROLES[room.id]||'study',primaryNodes=new Map();group.name=`home-interior-${room.id}`;
 const sets={study:['desk','armchair','bookshelf','plant'],bedroom:['bed','wardrobe','nightstand','plant'],kitchen:['counter','dining','fridge','plant'],'living room':['sofa','coffee','fireplace','plant'],'entrance hall':['console','bench','coat','plant'],library:['bookshelf','armchair','side','globe']};
 for(const kind of sets[role]){const p=prototype(k,kind,compact),placement=place(THREE,p,room,reserved,occupied);if(!placement)continue;group.add(p.group);occupied.push(placement.b);parts.push(p);const b=placement.b;obstacles.push({minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8,roomId:room.id,label:kind});}
 // Crowded/minimum rooms use a real narrow wall ledge rather than obstructing
 // their doors or shrinking major furniture to toy scale.
 if(parts.reduce((sum,p)=>sum+p.actions.length,0)<2){for(let attempt=0;attempt<2;attempt++){const p=prototype(k,'ledge',true),placement=place(THREE,p,room,reserved,occupied);if(!placement)break;group.add(p.group);occupied.push(placement.b);parts.push(p);const b=placement.b;obstacles.push({minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8,roomId:room.id,label:'wall ledge'});if(parts.reduce((sum,q)=>sum+q.actions.length,0)>=2)break;}}
 group.updateMatrixWorld(true);
 const anchorObstacles=obstacles.concat(reserved.filter(b=>b.kind==='idea').map(b=>({...b,minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8})));
 for(const part of parts)for(const a of part.actions){if(interactions.length>=4)break;const target=a.target.clone().applyMatrix4(part.group.matrixWorld),front=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),part.group.rotation.y),anchor=freeAnchor(room,target,anchorObstacles,{x:target.x+front.x*.7,z:target.z+front.z*.7});if(!anchor)continue;
  const metadata={homeAction:a.type,roomId:room.id,label:a.label,anchor,lookAt:{x:target.x,z:target.z},height:a.type==='sit'?.96:a.type==='rest'?1.05:1.65,homeRole:role,primary:true};a.node.traverse(node=>{if(node.isMesh)node.userData={...node.userData,...metadata};});interactions.push(metadata);primaryNodes.set(a.node,metadata);
 }
 const placed=new Set(parts.map(p=>p.group));
 for(const b of k.books){if(!placed.has(b.root))continue;const existing=primaryNodes.get(b.node);if(existing&&existing.homeAction==='journal')continue;const target=b.target.clone().applyMatrix4(b.root.matrixWorld),anchor=existing?.anchor||freeAnchor(room,target,anchorObstacles);if(!anchor)continue;
  const data=existing||{homeAction:'read',roomId:room.id,anchor,lookAt:{x:target.x,z:target.z},height:1.65,homeRole:role,primary:false};Object.assign(data,{bookId:b.bookId,bookInstanceId:`home-book-${room.id}-${b.instance}`,label:`Read “${HOME_BOOKS[b.bookId]}”`});b.node.traverse(node=>{if(node.isMesh)node.userData={...node.userData,...data};});if(!existing)interactions.push(data);
 }
 let lampIndex=0;
 for(const l of k.lights){if(!placed.has(l.root))continue;const target=l.target.clone().applyMatrix4(l.root.matrixWorld),anchor=freeAnchor(room,target,anchorObstacles);if(!anchor)continue;const homeLightId=`home-light-${room.id}-${lampIndex++}`,data={homeAction:'light',roomId:room.id,label:'Switch the lamp on or off',anchor,lookAt:{x:target.x,z:target.z},height:1.65,homeRole:role,homeLightId,primary:false};l.node.userData.homeLightId=homeLightId;l.node.traverse(node=>{if(node.isMesh)node.userData={...node.userData,...data};});interactions.push(data);}
 group.userData={homeRole:role,roomId:room.id,obstacles,interactions,reserved:reserved.map(b=>({...b,minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8}))};
 return {group,obstacles,interactions};
}

function furnishRoom(THREE,room,house,walk=true){return buildInterior(house,room,THREE,{walk}).group;}

function toggleHomeLight(group,homeLightId){let found=null;group.traverse(node=>{if(node.isGroup&&node.userData.homeLightId===homeLightId)found=node;});if(!found)return null;const on=!found.userData.homeLampOn;found.userData.homeLampOn=on;found.traverse(node=>{if(node.isPointLight)node.intensity=on?(node.userData.configuredIntensity??1.6):0;if(node.userData.homeBulb&&node.material)node.material.emissiveIntensity=on?(node.userData.configuredEmissive??.35):0;});return on;}

// A walkable, fictional artists' neighbourhood. The supplied catalog owns the
// artwork titles and images; these buildings make places to explore them.
function buildArtCityOriginal(THREE,artists,{artworkUrl}={}){
 if(!THREE?.Group||!Array.isArray(artists)||artists.length<1||artists.length>10)throw Error('Build the artist city with one to ten catalog artists.');
 const ids=new Set();for(const artist of artists)if(!artist||typeof artist.id!=='string'||ids.has(artist.id)){throw Error('Each city house needs a unique catalog artist.');}else ids.add(artist.id);
 const group=new THREE.Group();group.name='Artist City';
 const houses=[],colliders=[],materials=new Map(),geometries=new Map(),textures=new Map(),disposedTextures=new WeakSet(),artMeshes=[],legMatrices=[],brushMatrices=[];
 const bounds={minX:-28,maxX:28,minZ:-17,maxZ:17},spawn={x:-24,z:0,yaw:-Math.PI/2},guideAnchor={x:0,z:0,yaw:-Math.PI/2};let disposed=false;
 const color=(value,fallback)=>typeof value==='string'&&/^#[a-f0-9]{3}(?:[a-f0-9]{3})?$/i.test(value)?value:fallback;
 const material=(tone,kind='standard')=>{const key=kind+tone;if(!materials.has(key))materials.set(key,kind==='basic'?new THREE.MeshBasicMaterial({color:tone,side:THREE.DoubleSide}):new THREE.MeshStandardMaterial({color:tone,roughness:.86}));return materials.get(key);};
 const geometry=(key,make)=>{if(!geometries.has(key))geometries.set(key,make());return geometries.get(key);};
 function box(parent,w,h,d,x,y,z,tone,data){const mesh=new THREE.Mesh(geometry(['box',w,h,d].join(':'),()=>new THREE.BoxGeometry(w,h,d)),material(tone));mesh.position.set(x,y,z);if(data)mesh.userData={...data};parent.add(mesh);return mesh;}
 function worldPoint(house,x,z){const direction=house.row===0?1:-1;return {x:house.cx+direction*x,z:house.cz+direction*z};}
 function collision(house,x,z,w,d,label){const p=worldPoint(house,x,z);colliders.push({minX:p.x-w/2,maxX:p.x+w/2,minZ:p.z-d/2,maxZ:p.z+d/2,label});}
 function addLeg(house,x,y,z,w,h,d){const p=worldPoint(house,x,z),matrix=new THREE.Matrix4().compose(new THREE.Vector3(p.x,y,p.z),new THREE.Quaternion(),new THREE.Vector3(w,h,d));legMatrices.push(matrix);}
 function localMatrix(house,x,y,z,rotation){const p=worldPoint(house,x,z),q=new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation.x,rotation.y+(house.row===1?Math.PI:0),rotation.z));return new THREE.Matrix4().compose(new THREE.Vector3(p.x,y,p.z),q,new THREE.Vector3(1,1,1));}
 function plaque(parent,title,w,h,x,y,z,rotation,data,tone='#263d3e'){
  const mesh=new THREE.Mesh(geometry('label-plane',()=>new THREE.PlaneGeometry(1,1)),material(tone,'basic'));mesh.scale.set(w,h,1);mesh.position.set(x,y,z);mesh.rotation.y=rotation;mesh.userData={...data,label:data?.label||title};parent.add(mesh);
  if(typeof document!=='undefined'&&document.createElement){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d');if(ctx){ctx.fillStyle=tone;ctx.fillRect(0,0,768,192);ctx.fillStyle='#fff7e9';ctx.font='600 46px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(title).slice(0,55),384,96,716);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.set('label:'+textures.size,texture);const labelMaterial=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});materials.set('label:'+materials.size,labelMaterial);mesh.material=labelMaterial;}}
  return mesh;
 }
 function roofGeometry(style){return geometry('roof:'+style,()=>{
  const tall=style==='high'?4.7:style==='hip'?4.1:4.35,ridge=style==='hip'?1.45:3.36,shift=style==='offset'?.4:0,w=style==='eaves'?4.05:3.83;
  const p=[[-w,3,-3.36],[w,3,-3.36],[w,3,3.36],[-w,3,3.36],[shift,tall,-ridge],[shift,tall,ridge]],faces=[[4,1,0],[5,2,1],[4,5,1],[5,3,2],[4,0,3],[5,4,3],[2,3,0],[1,2,0]],vertices=faces.flatMap(face=>face.flatMap(index=>p[index]));
  const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));result.computeVertexNormals();return result;
 });}
 function windowWallGeometry(){return geometry('window-wall',()=>{const outer=new THREE.Shape();outer.moveTo(-3.5,0);outer.lineTo(-.9,0);outer.lineTo(-.9,3);outer.lineTo(-3.5,3);outer.closePath();const hole=new THREE.Path();hole.moveTo(-2.83,1.1);hole.lineTo(-2.83,2.12);hole.lineTo(-1.57,2.12);hole.lineTo(-1.57,1.1);hole.closePath();outer.holes.push(hole);const result=new THREE.ExtrudeGeometry(outer,{depth:.18,bevelEnabled:false});result.translate(0,0,2.91);return result;});}
 function windowFrameGeometry(){return geometry('window-frame',()=>{const shape=new THREE.Shape();shape.moveTo(-.72,-.59);shape.lineTo(.72,-.59);shape.lineTo(.72,.59);shape.lineTo(-.72,.59);shape.closePath();const hole=new THREE.Path();hole.moveTo(-.6,-.47);hole.lineTo(-.6,.47);hole.lineTo(.6,.47);hole.lineTo(.6,-.47);hole.closePath();shape.holes.push(hole);return new THREE.ShapeGeometry(shape);});}
 function localImageUrl(value){
  if(typeof value==='string'&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(value))return value;
  if(typeof value==='string'&&/^https?:/i.test(value)&&typeof location!=='undefined'&&new URL(value,location.href).origin===location.origin)return value;
  if(typeof value!=='string'||value.length>1200||value.includes('\\')||value.split(/[/?#]/).includes('..'))return null;
  if(/^blob:/i.test(value))return value;
  // The catalog's bundled raster assets are local to the offline app or Pages.
  // A source link belongs in the inspector, rather than an automatic request.
  if(/^(?:\.\/|\/)?[a-z0-9_.\-/]+\.(?:jpe?g|png|webp)$/i.test(value)&&!value.includes('//'))return value;
  return null;
 }
 function fitArt(mesh,width,height){const image=mesh.material.map?.image,ratio=Number(image?.width)/Number(image?.height);if(!Number.isFinite(ratio)||ratio<=0){mesh.scale.set(width,height,1);return;}if(width/height>ratio)mesh.scale.set(height*ratio,height,1);else mesh.scale.set(width,width/ratio,1);}
 function disposeTexture(texture){if(!disposedTextures.has(texture)){disposedTextures.add(texture);texture.dispose();}}
 function loadArtwork(mesh,artist,work){
  let requested;try{requested=artworkUrl?artworkUrl(artist,work):work.imageUrl||work.image;}catch{requested=null;}
  const url=localImageUrl(requested);mesh.userData.imageStatus=url?'loading':'unavailable';
  if(!url)return;if(typeof document==='undefined'){mesh.userData.imageStatus='offline-placeholder';return;}mesh.userData.imageUrl=url;
  if(!textures.has(url))try{const texture=new THREE.TextureLoader().load(url,loaded=>{loaded.colorSpace=THREE.SRGBColorSpace;if(disposed){disposeTexture(loaded);return;}for(const frame of artMeshes)if(frame.userData.imageUrl===url){frame.material.map=loaded;frame.material.color.set('#ffffff');frame.material.needsUpdate=true;frame.userData.imageStatus='ready';fitArt(frame,1.4,1.06);}},undefined,()=>{if(!disposed)for(const frame of artMeshes)if(frame.userData.imageUrl===url){frame.userData.imageStatus='unavailable';frame.material.map=null;frame.material.needsUpdate=true;}});texture.colorSpace=THREE.SRGBColorSpace;textures.set(url,texture);}catch{mesh.userData.imageStatus='unavailable';return;}
  mesh.material.map=textures.get(url);if(mesh.material.map?.image?.width){mesh.userData.imageStatus='ready';mesh.material.color.set('#ffffff');}fitArt(mesh,1.4,1.06);
 }
 function addWork(house,artist,work,index,position,rotation,approach){
  const frame=new THREE.Group();frame.name='Artwork '+work.id;frame.position.set(position.x,1.62,position.z);frame.rotation.y=rotation;frame.userData={artistId:artist.id,workId:work.id,label:String(work.title||work.id).slice(0,180)};house.group.add(frame);
  box(frame,1.63,1.28,.07,0,0,0,'#64513c',frame.userData);
  const mat=new THREE.MeshBasicMaterial({color:'#eee9dd',side:THREE.DoubleSide});materials.set('work:'+artist.id+':'+index,mat);
  const painting=new THREE.Mesh(geometry('art-plane',()=>new THREE.PlaneGeometry(1,1)),mat);painting.position.z=.044;painting.scale.set(1.4,1.06,1);painting.userData={...frame.userData};frame.add(painting);artMeshes.push(painting);loadArtwork(painting,artist,work);
  const p=worldPoint(house,approach.x,approach.z),target=worldPoint(house,position.x,position.z);house.approaches.push({artistId:artist.id,workId:work.id,x:p.x,z:p.z,yaw:Math.atan2(p.x-target.x,p.z-target.z),lookAt:{x:target.x,y:1.62,z:target.z}});
 }
 function facadeDetails(house,artist,accent){
  const parent=house.group,data={artistId:artist.id,artAction:'profile',label:'Discover '+house.name+'’s approach'};let layer=0;
  const panel=(w,h,x,y,tone,turn=0)=>{const mesh=box(parent,w,h,.045,x,y,3.13,tone,data);mesh.rotation.z=turn;return mesh;};
  const circle=(radius,x,y,tone,ring=false)=>{const mesh=new THREE.Mesh(geometry((ring?'ring:':'circle:')+radius,()=>ring?new THREE.RingGeometry(radius*.72,radius,24):new THREE.CircleGeometry(radius,24)),material(tone,'basic'));mesh.position.set(x,y,3.17+(++layer)*.005);mesh.userData={...data};parent.add(mesh);return mesh;};
  // These architectural studies are invented teaching details, not reproductions
  // or claims about the artists' historical homes.
  switch(artist.id){
   case 'monet':{
    box(parent,1.5,.24,.36,-2.2,.2,3.37,'#6e7960',data);collision(house,-2.2,3.37,1.5,.36,'Flower planter');
    for(let flower=0;flower<4;flower++){const x=-2.7+flower*.33;box(parent,.026,.24,.026,x,.43,3.45,'#5b7957',data);const bloom=circle(.085,x,.56,['#d09bb2','#ead1a0','#baa3d0','#eac4a4'][flower]);bloom.position.z=3.47;}
    break;
   }
   case 'kandinsky':panel(1.45,1.16,2.2,1.62,'#d5c7a9');circle(.37,2.07,1.64,'#3c6684');circle(.23,2.42,1.83,'#c79848');circle(.15,2.4,1.4,'#9d534f');panel(1.5,.045,2.19,1.72,'#414547',.6);break;
   case 'van-gogh':circle(.5,2.2,1.66,'#cfaa55');circle(.29,2.2,1.66,'#906b3c');for(let ray=0;ray<4;ray++)panel(.09,1.36,2.2,1.66,'#cfaa55',ray*Math.PI/4);circle(.26,2.2,1.66,'#806844');break;
   case 'hokusai':for(const y of [.65,1.28,1.91,2.55])panel(2.24,.11,2.2,y,'#67564a');panel(.12,2.06,1.36,1.61,'#67564a');panel(.12,2.06,3.04,1.61,'#67564a');break;
   case 'rodin':{
    box(parent,.58,.55,.48,-2.2,.3,3.47,'#7d796f',data);collision(house,-2.2,3.47,.58,.48,'Sculpture study plinth');
    const torso=new THREE.Mesh(geometry('sculpture-torso',()=>new THREE.DodecahedronGeometry(.27)),material('#646957'));torso.position.set(-2.2,.83,3.47);torso.scale.set(.85,1.35,.75);torso.userData={...data};parent.add(torso);
    const head=new THREE.Mesh(geometry('sculpture-head',()=>new THREE.IcosahedronGeometry(.16,1)),material('#646957'));head.position.set(-2.2,1.25,3.47);head.userData={...data};parent.add(head);break;
   }
   case 'hilma-af-klint':panel(1.48,1.5,2.2,1.6,'#d7b99b');circle(.44,2.2,1.69,'#bd8e91',true);circle(.24,2.2,1.97,'#eee0b3');circle(.25,2.2,1.39,'#6f93a1');circle(.12,2.2,1.69,'#ad9672');break;
   case 'mondrian':panel(1.7,1.38,2.2,1.65,'#303639');panel(.88,.75,1.86,1.9,'#b45d4c');panel(.59,.75,2.65,1.9,'#f2eee3');panel(.88,.43,1.86,1.23,'#e5c970');panel(.59,.43,2.65,1.23,'#597ba5');break;
   case 'lange':for(let frame=0;frame<3;frame++){panel(.53,1.08,1.55+frame*.65,1.65,'#6b6b64');panel(.41,.78,1.55+frame*.65,1.69,['#bab8ac','#9c9e97','#d1cec2'][frame]);}break;
   case 'morris':for(let motif=0;motif<6;motif++){const x=1.55+(motif%3)*.62,y=1.35+Math.floor(motif/3)*.6;panel(.38,.38,x,y,accent,Math.PI/4);circle(.1,x,y,'#d6c8a2');}break;
   case 'klee':for(let tile=0;tile<6;tile++)panel(.54,.5,1.58+(tile%3)*.62,1.34+Math.floor(tile/3)*.58,['#ad856c','#cdb26e','#9c665e','#83a1a1','#b795a0','#768a6d'][tile]);break;
  }
 }
 box(group,56,.08,34,0,-.08,0,'#a8b797');box(group,53,.06,7,0,-.01,0,'#cdc4ae');
 group.add(new THREE.AmbientLight('#fff4e4',.45));
 const roofStyles=['gable','offset','high','eaves','hip','high','gable','hip','eaves','offset'],roofColors=['#62766f','#424d61','#936e50','#394f68','#696967','#774f5d','#6b6973','#646e6f','#55736b','#857367'];
 for(let index=0;index<artists.length;index++){
  const artist=artists[index],row=Math.floor(index/5),cx=(index%5-2)*10,cz=row===0?-9:9,houseGroup=new THREE.Group();houseGroup.name=String(artist.name||artist.id);houseGroup.position.set(cx,0,cz);houseGroup.rotation.y=row===1?Math.PI:0;group.add(houseGroup);
  const house={id:artist.id,artistId:artist.id,name:artist.name||artist.id,row,cx,cz,group:houseGroup,minX:cx-3.5,maxX:cx+3.5,minZ:cz-3,maxZ:cz+3,approaches:[]};houses.push(house);
  const accent=color(artist.color,'#7c927b'),wallTone=color(artist.background,'#ece8dd');
  box(houseGroup,7,.08,6,0,-.04,0,index%2?'#c8bba4':'#d6cbb6');
  box(houseGroup,7,3,.18,0,1.5,-3,wallTone);collision(house,0,-3,7,.18,'Back wall');
  for(const x of [-3.5,3.5]){box(houseGroup,.18,3,6,x,1.5,0,wallTone);collision(house,x,0,.18,6,'Side wall');}
  const left=new THREE.Mesh(windowWallGeometry(),material(wallTone));houseGroup.add(left);collision(house,-2.2,3,2.6,.18,'Glazed front wall');
  box(houseGroup,2.6,3,.18,2.2,1.5,3,wallTone);collision(house,2.2,3,2.6,.18,'Front wall');
  const enter={artistId:artist.id,artAction:'enter',label:'Enter '+house.name+'’s house'};
  box(houseGroup,1.8,.75,.18,0,2.625,3,accent,enter);
  const roof=new THREE.Mesh(roofGeometry(roofStyles[index]),material(roofColors[index]));houseGroup.add(roof);
  const windowFrame=new THREE.Mesh(windowFrameGeometry(),material('#f3ede0','basic'));windowFrame.position.set(-2.2,1.61,3.115);houseGroup.add(windowFrame);
  const glass=new THREE.Mesh(geometry('window-glass',()=>new THREE.PlaneGeometry(1.23,1)),new THREE.MeshStandardMaterial({color:'#bed7dc',roughness:.14,metalness:.1,transparent:true,opacity:.3,side:THREE.DoubleSide}));materials.set('glass:'+index,glass.material);glass.position.set(-2.2,1.61,3.025);houseGroup.add(glass);
  box(houseGroup,2.75,.44,.08,0,2.45,3.15,'#263d3e',{artistId:artist.id,artAction:'profile',label:'Explore '+house.name});
  plaque(houseGroup,house.name,2.63,.35,0,2.45,3.196,0,{artistId:artist.id,artAction:'profile',label:'About '+house.name});
  box(houseGroup,1.7,.035,.5,0,.0175,3.2,'#d6c6ac',enter);
  box(houseGroup,2.05,.11,.68,0,.47,.5,'#725d48',{artistId:artist.id,artAction:'profile',label:'Reflect on '+house.name+'’s work'});collision(house,0,.5,2.05,.68,'Gallery bench');
  for(const x of [-.82,.82])for(const z of [.27,.73])addLeg(house,x,.23,z,.12,.43,.12);
  box(houseGroup,1.3,.1,.68,2.03,.77,1.65,'#8a7156',{artistId:artist.id,artAction:'profile',label:'Try '+house.name+'’s approach'});collision(house,2.03,1.65,1.3,.68,'Artist worktable');
  for(const x of [1.51,2.55])for(const z of [1.43,1.87])addLeg(house,x,.38,z,.11,.73,.11);
  const palette=new THREE.Mesh(geometry('palette',()=>new THREE.CylinderGeometry(.2,.2,.025,16)),material(accent));palette.scale.z=.7;palette.position.set(1.84,.84,1.65);palette.userData={artistId:artist.id,artAction:'profile',label:'Explore '+house.name+'’s artistic practice'};houseGroup.add(palette);
  facadeDetails(house,artist,accent);
  for(let brush=0;brush<3;brush++)brushMatrices.push(localMatrix(house,2.2+brush*.06,.837,1.65,{x:Math.PI/2,y:.3+brush*.18,z:0}));
  const works=Array.isArray(artist.works)?artist.works.slice(0,6):[];
  const positions=[{x:-2.05,z:-2.85},{x:0,z:-2.85},{x:2.05,z:-2.85},{x:-3.35,z:-1.35},{x:-3.35,z:.65},{x:3.35,z:-.65}],turns=[0,0,0,Math.PI/2,Math.PI/2,-Math.PI/2],approaches=[{x:-2.05,z:-1.45},{x:0,z:-1.45},{x:2.05,z:-1.45},{x:-2,z:-1.35},{x:-2,z:.65},{x:2,z:-.65}];
  for(let work=0;work<works.length;work++)addWork(house,artist,works[work],work,positions[work],turns[work],approaches[work]);
  const door=worldPoint(house,0,3),inside=worldPoint(house,0,1.85);house.entry={x:door.x,z:door.z+(row===0?.7:-.7),yaw:row===0?0:Math.PI};house.spawnInside={x:inside.x,z:inside.z,yaw:row===0?0:Math.PI,artistId:artist.id};
  box(group,1.7,.025,2.5,cx,.0025,row===0?-4.55:4.55,'#d8ceb9');
 }
 const legs=new THREE.InstancedMesh(geometry('furniture-leg',()=>new THREE.BoxGeometry(1,1,1)),material('#665745'),legMatrices.length);legMatrices.forEach((matrix,index)=>legs.setMatrixAt(index,matrix));legs.instanceMatrix.needsUpdate=true;group.add(legs);
 const brushes=new THREE.InstancedMesh(geometry('artist-brush',()=>new THREE.CylinderGeometry(.014,.014,.28,6)),material('#bd9c73'),brushMatrices.length);brushMatrices.forEach((matrix,index)=>brushes.setMatrixAt(index,matrix));brushes.instanceMatrix.needsUpdate=true;group.add(brushes);
 const returnAction={artAction:'return-home',label:'Return to your House of Ideas'};
 for(const z of [-1.12,1.12]){box(group,.23,2.2,.23,-26,1.1,z,'#536657',returnAction);colliders.push({minX:-26.115,maxX:-25.885,minZ:z-.115,maxZ:z+.115,label:'Return gate post'});}
 box(group,.25,.24,2.47,-26,2.18,0,'#536657',returnAction);plaque(group,'House of Ideas',2.18,.19,-25.864,2.18,0,Math.PI/2,returnAction);
 group.updateMatrixWorld(true);
 function canStand(x,z){return Number.isFinite(x)&&Number.isFinite(z)&&x>bounds.minX+.22&&x<bounds.maxX-.22&&z>bounds.minZ+.22&&z<bounds.maxZ-.22&&!colliders.some(c=>x>c.minX-.22&&x<c.maxX+.22&&z>c.minZ-.22&&z<c.maxZ+.22);}
 function insideAt(x,z){return houses.find(h=>x>h.minX+.16&&x<h.maxX-.16&&z>h.minZ+.16&&z<h.maxZ-.16)?.artistId||null;}
 return {group,houses,targets:[group],bounds,spawn,guideAnchor,colliders,canStand,insideAt,entryFor(id){const house=houses.find(h=>h.artistId===id);return house?{...house.spawnInside}:null;},dispose(){if(disposed)return;disposed=true;for(const texture of new Set(textures.values()))disposeTexture(texture);for(const item of new Set(materials.values()))item.dispose();for(const item of new Set(geometries.values()))item.dispose();group.clear();}};
}

function buildArtCity(T=THREE,artists=ARTISTS,options={}){
 assertThree(T);if(!Array.isArray(artists)){options=artists||{};artists=ARTISTS;}
 return buildArtCityOriginal(T,artists,{...options,artworkUrl:(artist,work)=>assetUrl(options.artworkUrl?options.artworkUrl(artist,work):work.imageUrl,options)});
}
// Official Three.js r160 GLTFLoader plus its sole imported geometry helper.
// MIT license: city-source-assets/vendor/LICENSE-three-r160.txt.
const GLTFLoader=(function(THREE){
 const {AnimationClip,
	Bone,
	Box3,
	BufferAttribute,
	BufferGeometry,
	ClampToEdgeWrapping,
	Color,
	ColorManagement,
	DirectionalLight,
	DoubleSide,
	FileLoader,
	FrontSide,
	Group,
	ImageBitmapLoader,
	InstancedMesh,
	InterleavedBuffer,
	InterleavedBufferAttribute,
	Interpolant,
	InterpolateDiscrete,
	InterpolateLinear,
	Line,
	LineBasicMaterial,
	LineLoop,
	LineSegments,
	LinearFilter,
	LinearMipmapLinearFilter,
	LinearMipmapNearestFilter,
	LinearSRGBColorSpace,
	Loader,
	LoaderUtils,
	Material,
	MathUtils,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	MirroredRepeatWrapping,
	NearestFilter,
	NearestMipmapLinearFilter,
	NearestMipmapNearestFilter,
	NumberKeyframeTrack,
	Object3D,
	OrthographicCamera,
	PerspectiveCamera,
	PointLight,
	Points,
	PointsMaterial,
	PropertyBinding,
	Quaternion,
	QuaternionKeyframeTrack,
	RepeatWrapping,
	Skeleton,
	SkinnedMesh,
	Sphere,
	SpotLight,
	Texture,
	TextureLoader,
	TriangleFanDrawMode,
	TriangleStripDrawMode,
	Vector2,
	Vector3,
	VectorKeyframeTrack,
	SRGBColorSpace,
	InstancedBufferAttribute,TrianglesDrawMode}=THREE;
 function toTrianglesDrawMode( geometry, drawMode ) {

	if ( drawMode === TrianglesDrawMode ) {

		console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.' );
		return geometry;

	}

	if ( drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode ) {

		let index = geometry.getIndex();

		// generate index if not present

		if ( index === null ) {

			const indices = [];

			const position = geometry.getAttribute( 'position' );

			if ( position !== undefined ) {

				for ( let i = 0; i < position.count; i ++ ) {

					indices.push( i );

				}

				geometry.setIndex( indices );
				index = geometry.getIndex();

			} else {

				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
				return geometry;

			}

		}

		//

		const numberOfTriangles = index.count - 2;
		const newIndices = [];

		if ( drawMode === TriangleFanDrawMode ) {

			// gl.TRIANGLE_FAN

			for ( let i = 1; i <= numberOfTriangles; i ++ ) {

				newIndices.push( index.getX( 0 ) );
				newIndices.push( index.getX( i ) );
				newIndices.push( index.getX( i + 1 ) );

			}

		} else {

			// gl.TRIANGLE_STRIP

			for ( let i = 0; i < numberOfTriangles; i ++ ) {

				if ( i % 2 === 0 ) {

					newIndices.push( index.getX( i ) );
					newIndices.push( index.getX( i + 1 ) );
					newIndices.push( index.getX( i + 2 ) );

				} else {

					newIndices.push( index.getX( i + 2 ) );
					newIndices.push( index.getX( i + 1 ) );
					newIndices.push( index.getX( i ) );

				}

			}

		}

		if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

		}

		// build final geometry

		const newGeometry = geometry.clone();
		newGeometry.setIndex( newIndices );
		newGeometry.clearGroups();

		return newGeometry;

	} else {

		console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
		return geometry;

	}

}

 class GLTFLoader extends Loader {

	constructor( manager ) {

		super( manager );

		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;

		this.pluginCallbacks = [];

		this.register( function ( parser ) {

			return new GLTFMaterialsClearcoatExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureBasisUExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureWebPExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureAVIFExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSheenExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsTransmissionExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsVolumeExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIorExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsEmissiveStrengthExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSpecularExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIridescenceExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsAnisotropyExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsBumpExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFLightsExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshoptCompression( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshGpuInstancing( parser );

		} );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		let resourcePath;

		if ( this.resourcePath !== '' ) {

			resourcePath = this.resourcePath;

		} else if ( this.path !== '' ) {

			// If a base path is set, resources will be relative paths from that plus the relative path of the gltf file
			// Example  path = 'https://my-cnd-server.com/', url = 'assets/models/model.gltf'
			// resourcePath = 'https://my-cnd-server.com/assets/models/'
			// referenced resource 'model.bin' will be loaded from 'https://my-cnd-server.com/assets/models/model.bin'
			// referenced resource '../textures/texture.png' will be loaded from 'https://my-cnd-server.com/assets/textures/texture.png'
			const relativeUrl = LoaderUtils.extractUrlBase( url );
			resourcePath = LoaderUtils.resolveURL( relativeUrl, this.path );

		} else {

			resourcePath = LoaderUtils.extractUrlBase( url );

		}

		// Tells the LoadingManager to track an extra item, which resolves after
		// the model is fully loaded. This means the count of items loaded will
		// be incorrect, but ensures manager.onLoad() does not fire early.
		this.manager.itemStart( url );

		const _onError = function ( e ) {

			if ( onError ) {

				onError( e );

			} else {

				console.error( e );

			}

			scope.manager.itemError( url );
			scope.manager.itemEnd( url );

		};

		const loader = new FileLoader( this.manager );

		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );

		loader.load( url, function ( data ) {

			try {

				scope.parse( data, resourcePath, function ( gltf ) {

					onLoad( gltf );

					scope.manager.itemEnd( url );

				}, _onError );

			} catch ( e ) {

				_onError( e );

			}

		}, onProgress, _onError );

	}

	setDRACOLoader( dracoLoader ) {

		this.dracoLoader = dracoLoader;
		return this;

	}

	setDDSLoader() {

		throw new Error(

			'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'

		);

	}

	setKTX2Loader( ktx2Loader ) {

		this.ktx2Loader = ktx2Loader;
		return this;

	}

	setMeshoptDecoder( meshoptDecoder ) {

		this.meshoptDecoder = meshoptDecoder;
		return this;

	}

	register( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) === - 1 ) {

			this.pluginCallbacks.push( callback );

		}

		return this;

	}

	unregister( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) !== - 1 ) {

			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

		}

		return this;

	}

	parse( data, path, onLoad, onError ) {

		let json;
		const extensions = {};
		const plugins = {};
		const textDecoder = new TextDecoder();

		if ( typeof data === 'string' ) {

			json = JSON.parse( data );

		} else if ( data instanceof ArrayBuffer ) {

			const magic = textDecoder.decode( new Uint8Array( data, 0, 4 ) );

			if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

				try {

					extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

				} catch ( error ) {

					if ( onError ) onError( error );
					return;

				}

				json = JSON.parse( extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content );

			} else {

				json = JSON.parse( textDecoder.decode( data ) );

			}

		} else {

			json = data;

		}

		if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

			if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
			return;

		}

		const parser = new GLTFParser( json, {

			path: path || this.resourcePath || '',
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder

		} );

		parser.fileLoader.setRequestHeader( this.requestHeader );

		for ( let i = 0; i < this.pluginCallbacks.length; i ++ ) {

			const plugin = this.pluginCallbacks[ i ]( parser );

			if ( ! plugin.name ) console.error( 'THREE.GLTFLoader: Invalid plugin found: missing name' );

			plugins[ plugin.name ] = plugin;

			// Workaround to avoid determining as unknown extension
			// in addUnknownExtensionsToUserData().
			// Remove this workaround if we move all the existing
			// extension handlers to plugin system
			extensions[ plugin.name ] = true;

		}

		if ( json.extensionsUsed ) {

			for ( let i = 0; i < json.extensionsUsed.length; ++ i ) {

				const extensionName = json.extensionsUsed[ i ];
				const extensionsRequired = json.extensionsRequired || [];

				switch ( extensionName ) {

					case EXTENSIONS.KHR_MATERIALS_UNLIT:
						extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
						break;

					case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
						extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
						break;

					case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
						extensions[ extensionName ] = new GLTFTextureTransformExtension();
						break;

					case EXTENSIONS.KHR_MESH_QUANTIZATION:
						extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
						break;

					default:

						if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

							console.warn( 'THREE.GLTFLoader: Unknown extension "' + extensionName + '".' );

						}

				}

			}

		}

		parser.setExtensions( extensions );
		parser.setPlugins( plugins );
		parser.parse( onLoad, onError );

	}

	parseAsync( data, path ) {

		const scope = this;

		return new Promise( function ( resolve, reject ) {

			scope.parse( data, path, resolve, reject );

		} );

	}

}

/* GLTFREGISTRY */

function GLTFRegistry() {

	let objects = {};

	return	{

		get: function ( key ) {

			return objects[ key ];

		},

		add: function ( key, object ) {

			objects[ key ] = object;

		},

		remove: function ( key ) {

			delete objects[ key ];

		},

		removeAll: function () {

			objects = {};

		}

	};

}

/*********************************/
/********** EXTENSIONS ***********/
/*********************************/

const EXTENSIONS = {
	KHR_BINARY_GLTF: 'KHR_binary_glTF',
	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
	KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
	KHR_MATERIALS_IOR: 'KHR_materials_ior',
	KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
	KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
	KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
	KHR_MATERIALS_IRIDESCENCE: 'KHR_materials_iridescence',
	KHR_MATERIALS_ANISOTROPY: 'KHR_materials_anisotropy',
	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
	KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
	KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
	KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
	KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
	KHR_MATERIALS_EMISSIVE_STRENGTH: 'KHR_materials_emissive_strength',
	EXT_MATERIALS_BUMP: 'EXT_materials_bump',
	EXT_TEXTURE_WEBP: 'EXT_texture_webp',
	EXT_TEXTURE_AVIF: 'EXT_texture_avif',
	EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
	EXT_MESH_GPU_INSTANCING: 'EXT_mesh_gpu_instancing'
};

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 */
class GLTFLightsExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

		// Object3D instance caches
		this.cache = { refs: {}, uses: {} };

	}

	_markDefs() {

		const parser = this.parser;
		const nodeDefs = this.parser.json.nodes || [];

		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.extensions
					&& nodeDef.extensions[ this.name ]
					&& nodeDef.extensions[ this.name ].light !== undefined ) {

				parser._addNodeRef( this.cache, nodeDef.extensions[ this.name ].light );

			}

		}

	}

	_loadLight( lightIndex ) {

		const parser = this.parser;
		const cacheKey = 'light:' + lightIndex;
		let dependency = parser.cache.get( cacheKey );

		if ( dependency ) return dependency;

		const json = parser.json;
		const extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
		const lightDefs = extensions.lights || [];
		const lightDef = lightDefs[ lightIndex ];
		let lightNode;

		const color = new Color( 0xffffff );

		if ( lightDef.color !== undefined ) color.setRGB( lightDef.color[ 0 ], lightDef.color[ 1 ], lightDef.color[ 2 ], LinearSRGBColorSpace );

		const range = lightDef.range !== undefined ? lightDef.range : 0;

		switch ( lightDef.type ) {

			case 'directional':
				lightNode = new DirectionalLight( color );
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			case 'point':
				lightNode = new PointLight( color );
				lightNode.distance = range;
				break;

			case 'spot':
				lightNode = new SpotLight( color );
				lightNode.distance = range;
				// Handle spotlight properties.
				lightDef.spot = lightDef.spot || {};
				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
				lightNode.angle = lightDef.spot.outerConeAngle;
				lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			default:
				throw new Error( 'THREE.GLTFLoader: Unexpected light type: ' + lightDef.type );

		}

		// Some lights (e.g. spot) default to a position other than the origin. Reset the position
		// here, because node-level parsing will only override position if explicitly specified.
		lightNode.position.set( 0, 0, 0 );

		lightNode.decay = 2;

		assignExtrasToUserData( lightNode, lightDef );

		if ( lightDef.intensity !== undefined ) lightNode.intensity = lightDef.intensity;

		lightNode.name = parser.createUniqueName( lightDef.name || ( 'light_' + lightIndex ) );

		dependency = Promise.resolve( lightNode );

		parser.cache.add( cacheKey, dependency );

		return dependency;

	}

	getDependency( type, index ) {

		if ( type !== 'light' ) return;

		return this._loadLight( index );

	}

	createNodeAttachment( nodeIndex ) {

		const self = this;
		const parser = this.parser;
		const json = parser.json;
		const nodeDef = json.nodes[ nodeIndex ];
		const lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
		const lightIndex = lightDef.light;

		if ( lightIndex === undefined ) return null;

		return this._loadLight( lightIndex ).then( function ( light ) {

			return parser._getNodeRef( self.cache, lightIndex, light );

		} );

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 */
class GLTFMaterialsUnlitExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

	}

	getMaterialType() {

		return MeshBasicMaterial;

	}

	extendParams( materialParams, materialDef, parser ) {

		const pending = [];

		materialParams.color = new Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		const metallicRoughness = materialDef.pbrMetallicRoughness;

		if ( metallicRoughness ) {

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.setRGB( array[ 0 ], array[ 1 ], array[ 2 ], LinearSRGBColorSpace );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace ) );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Emissive Strength Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
 */
class GLTFMaterialsEmissiveStrengthExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const emissiveStrength = materialDef.extensions[ this.name ].emissiveStrength;

		if ( emissiveStrength !== undefined ) {

			materialParams.emissiveIntensity = emissiveStrength;

		}

		return Promise.resolve();

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 */
class GLTFMaterialsClearcoatExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.clearcoatFactor !== undefined ) {

			materialParams.clearcoat = extension.clearcoatFactor;

		}

		if ( extension.clearcoatTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatMap', extension.clearcoatTexture ) );

		}

		if ( extension.clearcoatRoughnessFactor !== undefined ) {

			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

		}

		if ( extension.clearcoatRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture ) );

		}

		if ( extension.clearcoatNormalTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture ) );

			if ( extension.clearcoatNormalTexture.scale !== undefined ) {

				const scale = extension.clearcoatNormalTexture.scale;

				materialParams.clearcoatNormalScale = new Vector2( scale, scale );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Iridescence Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
 */
class GLTFMaterialsIridescenceExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.iridescenceFactor !== undefined ) {

			materialParams.iridescence = extension.iridescenceFactor;

		}

		if ( extension.iridescenceTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'iridescenceMap', extension.iridescenceTexture ) );

		}

		if ( extension.iridescenceIor !== undefined ) {

			materialParams.iridescenceIOR = extension.iridescenceIor;

		}

		if ( materialParams.iridescenceThicknessRange === undefined ) {

			materialParams.iridescenceThicknessRange = [ 100, 400 ];

		}

		if ( extension.iridescenceThicknessMinimum !== undefined ) {

			materialParams.iridescenceThicknessRange[ 0 ] = extension.iridescenceThicknessMinimum;

		}

		if ( extension.iridescenceThicknessMaximum !== undefined ) {

			materialParams.iridescenceThicknessRange[ 1 ] = extension.iridescenceThicknessMaximum;

		}

		if ( extension.iridescenceThicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'iridescenceThicknessMap', extension.iridescenceThicknessTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Sheen Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
 */
class GLTFMaterialsSheenExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		materialParams.sheenColor = new Color( 0, 0, 0 );
		materialParams.sheenRoughness = 0;
		materialParams.sheen = 1;

		const extension = materialDef.extensions[ this.name ];

		if ( extension.sheenColorFactor !== undefined ) {

			const colorFactor = extension.sheenColorFactor;
			materialParams.sheenColor.setRGB( colorFactor[ 0 ], colorFactor[ 1 ], colorFactor[ 2 ], LinearSRGBColorSpace );

		}

		if ( extension.sheenRoughnessFactor !== undefined ) {

			materialParams.sheenRoughness = extension.sheenRoughnessFactor;

		}

		if ( extension.sheenColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenColorMap', extension.sheenColorTexture, SRGBColorSpace ) );

		}

		if ( extension.sheenRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenRoughnessMap', extension.sheenRoughnessTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
 */
class GLTFMaterialsTransmissionExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.transmissionFactor !== undefined ) {

			materialParams.transmission = extension.transmissionFactor;

		}

		if ( extension.transmissionTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'transmissionMap', extension.transmissionTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 */
class GLTFMaterialsVolumeExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;

		if ( extension.thicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'thicknessMap', extension.thicknessTexture ) );

		}

		materialParams.attenuationDistance = extension.attenuationDistance || Infinity;

		const colorArray = extension.attenuationColor || [ 1, 1, 1 ];
		materialParams.attenuationColor = new Color().setRGB( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ], LinearSRGBColorSpace );

		return Promise.all( pending );

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 */
class GLTFMaterialsIorExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const extension = materialDef.extensions[ this.name ];

		materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;

		return Promise.resolve();

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 */
class GLTFMaterialsSpecularExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;

		if ( extension.specularTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularIntensityMap', extension.specularTexture ) );

		}

		const colorArray = extension.specularColorFactor || [ 1, 1, 1 ];
		materialParams.specularColor = new Color().setRGB( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ], LinearSRGBColorSpace );

		if ( extension.specularColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularColorMap', extension.specularColorTexture, SRGBColorSpace ) );

		}

		return Promise.all( pending );

	}

}


/**
 * Materials bump Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/EXT_materials_bump
 */
class GLTFMaterialsBumpExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_MATERIALS_BUMP;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.bumpScale = extension.bumpFactor !== undefined ? extension.bumpFactor : 1.0;

		if ( extension.bumpTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'bumpMap', extension.bumpTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials anisotropy Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_anisotropy
 */
class GLTFMaterialsAnisotropyExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_ANISOTROPY;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.anisotropyStrength !== undefined ) {

			materialParams.anisotropy = extension.anisotropyStrength;

		}

		if ( extension.anisotropyRotation !== undefined ) {

			materialParams.anisotropyRotation = extension.anisotropyRotation;

		}

		if ( extension.anisotropyTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'anisotropyMap', extension.anisotropyTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * BasisU Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
 */
class GLTFTextureBasisUExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

	}

	loadTexture( textureIndex ) {

		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ this.name ];
		const loader = parser.options.ktx2Loader;

		if ( ! loader ) {

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures' );

			} else {

				// Assumes that the extension is optional and that a fallback texture is present
				return null;

			}

		}

		return parser.loadTextureImage( textureIndex, extension.source, loader );

	}

}

/**
 * WebP Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
 */
class GLTFTextureWebPExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
		this.isSupported = null;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.detectSupport().then( function ( isSupported ) {

			if ( isSupported ) return parser.loadTextureImage( textureIndex, extension.source, loader );

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: WebP required by asset but unsupported.' );

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture( textureIndex );

		} );

	}

	detectSupport() {

		if ( ! this.isSupported ) {

			this.isSupported = new Promise( function ( resolve ) {

				const image = new Image();

				// Lossy test image. Support for lossy images doesn't guarantee support for all
				// WebP images, unfortunately.
				image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

				image.onload = image.onerror = function () {

					resolve( image.height === 1 );

				};

			} );

		}

		return this.isSupported;

	}

}

/**
 * AVIF Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif
 */
class GLTFTextureAVIFExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
		this.isSupported = null;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.detectSupport().then( function ( isSupported ) {

			if ( isSupported ) return parser.loadTextureImage( textureIndex, extension.source, loader );

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: AVIF required by asset but unsupported.' );

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture( textureIndex );

		} );

	}

	detectSupport() {

		if ( ! this.isSupported ) {

			this.isSupported = new Promise( function ( resolve ) {

				const image = new Image();

				// Lossy test image.
				image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
				image.onload = image.onerror = function () {

					resolve( image.height === 1 );

				};

			} );

		}

		return this.isSupported;

	}

}

/**
 * meshopt BufferView Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
 */
class GLTFMeshoptCompression {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
		this.parser = parser;

	}

	loadBufferView( index ) {

		const json = this.parser.json;
		const bufferView = json.bufferViews[ index ];

		if ( bufferView.extensions && bufferView.extensions[ this.name ] ) {

			const extensionDef = bufferView.extensions[ this.name ];

			const buffer = this.parser.getDependency( 'buffer', extensionDef.buffer );
			const decoder = this.parser.options.meshoptDecoder;

			if ( ! decoder || ! decoder.supported ) {

				if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

					throw new Error( 'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files' );

				} else {

					// Assumes that the extension is optional and that fallback buffer data is present
					return null;

				}

			}

			return buffer.then( function ( res ) {

				const byteOffset = extensionDef.byteOffset || 0;
				const byteLength = extensionDef.byteLength || 0;

				const count = extensionDef.count;
				const stride = extensionDef.byteStride;

				const source = new Uint8Array( res, byteOffset, byteLength );

				if ( decoder.decodeGltfBufferAsync ) {

					return decoder.decodeGltfBufferAsync( count, stride, source, extensionDef.mode, extensionDef.filter ).then( function ( res ) {

						return res.buffer;

					} );

				} else {

					// Support for MeshoptDecoder 0.18 or earlier, without decodeGltfBufferAsync
					return decoder.ready.then( function () {

						const result = new ArrayBuffer( count * stride );
						decoder.decodeGltfBuffer( new Uint8Array( result ), count, stride, source, extensionDef.mode, extensionDef.filter );
						return result;

					} );

				}

			} );

		} else {

			return null;

		}

	}

}

/**
 * GPU Instancing Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
 *
 */
class GLTFMeshGpuInstancing {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
		this.parser = parser;

	}

	createNodeMesh( nodeIndex ) {

		const json = this.parser.json;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( ! nodeDef.extensions || ! nodeDef.extensions[ this.name ] ||
			nodeDef.mesh === undefined ) {

			return null;

		}

		const meshDef = json.meshes[ nodeDef.mesh ];

		// No Points or Lines + Instancing support yet

		for ( const primitive of meshDef.primitives ) {

			if ( primitive.mode !== WEBGL_CONSTANTS.TRIANGLES &&
				 primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP &&
				 primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN &&
				 primitive.mode !== undefined ) {

				return null;

			}

		}

		const extensionDef = nodeDef.extensions[ this.name ];
		const attributesDef = extensionDef.attributes;

		// @TODO: Can we support InstancedMesh + SkinnedMesh?

		const pending = [];
		const attributes = {};

		for ( const key in attributesDef ) {

			pending.push( this.parser.getDependency( 'accessor', attributesDef[ key ] ).then( accessor => {

				attributes[ key ] = accessor;
				return attributes[ key ];

			} ) );

		}

		if ( pending.length < 1 ) {

			return null;

		}

		pending.push( this.parser.createNodeMesh( nodeIndex ) );

		return Promise.all( pending ).then( results => {

			const nodeObject = results.pop();
			const meshes = nodeObject.isGroup ? nodeObject.children : [ nodeObject ];
			const count = results[ 0 ].count; // All attribute counts should be same
			const instancedMeshes = [];

			for ( const mesh of meshes ) {

				// Temporal variables
				const m = new Matrix4();
				const p = new Vector3();
				const q = new Quaternion();
				const s = new Vector3( 1, 1, 1 );

				const instancedMesh = new InstancedMesh( mesh.geometry, mesh.material, count );

				for ( let i = 0; i < count; i ++ ) {

					if ( attributes.TRANSLATION ) {

						p.fromBufferAttribute( attributes.TRANSLATION, i );

					}

					if ( attributes.ROTATION ) {

						q.fromBufferAttribute( attributes.ROTATION, i );

					}

					if ( attributes.SCALE ) {

						s.fromBufferAttribute( attributes.SCALE, i );

					}

					instancedMesh.setMatrixAt( i, m.compose( p, q, s ) );

				}

				// Add instance attributes to the geometry, excluding TRS.
				for ( const attributeName in attributes ) {

					if ( attributeName === '_COLOR_0' ) {

						const attr = attributes[ attributeName ];
						instancedMesh.instanceColor = new InstancedBufferAttribute( attr.array, attr.itemSize, attr.normalized );

					} else if ( attributeName !== 'TRANSLATION' &&
						 attributeName !== 'ROTATION' &&
						 attributeName !== 'SCALE' ) {

						mesh.geometry.setAttribute( attributeName, attributes[ attributeName ] );

					}

				}

				// Just in case
				Object3D.prototype.copy.call( instancedMesh, mesh );

				this.parser.assignFinalMaterial( instancedMesh );

				instancedMeshes.push( instancedMesh );

			}

			if ( nodeObject.isGroup ) {

				nodeObject.clear();

				nodeObject.add( ... instancedMeshes );

				return nodeObject;

			}

			return instancedMeshes[ 0 ];

		} );

	}

}

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

class GLTFBinaryExtension {

	constructor( data ) {

		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		const headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );
		const textDecoder = new TextDecoder();

		this.header = {
			magic: textDecoder.decode( new Uint8Array( data.slice( 0, 4 ) ) ),
			version: headerView.getUint32( 4, true ),
			length: headerView.getUint32( 8, true )
		};

		if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

			throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

		} else if ( this.header.version < 2.0 ) {

			throw new Error( 'THREE.GLTFLoader: Legacy binary file detected.' );

		}

		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		const chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
		let chunkIndex = 0;

		while ( chunkIndex < chunkContentsLength ) {

			const chunkLength = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			const chunkType = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

				const contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
				this.content = textDecoder.decode( contentArray );

			} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice( byteOffset, byteOffset + chunkLength );

			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;

		}

		if ( this.content === null ) {

			throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

		}

	}

}

/**
 * DRACO Mesh Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
 */
class GLTFDracoMeshCompressionExtension {

	constructor( json, dracoLoader ) {

		if ( ! dracoLoader ) {

			throw new Error( 'THREE.GLTFLoader: No DRACOLoader instance provided.' );

		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;
		this.dracoLoader.preload();

	}

	decodePrimitive( primitive, parser ) {

		const json = this.json;
		const dracoLoader = this.dracoLoader;
		const bufferViewIndex = primitive.extensions[ this.name ].bufferView;
		const gltfAttributeMap = primitive.extensions[ this.name ].attributes;
		const threeAttributeMap = {};
		const attributeNormalizedMap = {};
		const attributeTypeMap = {};

		for ( const attributeName in gltfAttributeMap ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			threeAttributeMap[ threeAttributeName ] = gltfAttributeMap[ attributeName ];

		}

		for ( const attributeName in primitive.attributes ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			if ( gltfAttributeMap[ attributeName ] !== undefined ) {

				const accessorDef = json.accessors[ primitive.attributes[ attributeName ] ];
				const componentType = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

				attributeTypeMap[ threeAttributeName ] = componentType.name;
				attributeNormalizedMap[ threeAttributeName ] = accessorDef.normalized === true;

			}

		}

		return parser.getDependency( 'bufferView', bufferViewIndex ).then( function ( bufferView ) {

			return new Promise( function ( resolve, reject ) {

				dracoLoader.decodeDracoFile( bufferView, function ( geometry ) {

					for ( const attributeName in geometry.attributes ) {

						const attribute = geometry.attributes[ attributeName ];
						const normalized = attributeNormalizedMap[ attributeName ];

						if ( normalized !== undefined ) attribute.normalized = normalized;

					}

					resolve( geometry );

				}, threeAttributeMap, attributeTypeMap, LinearSRGBColorSpace, reject );

			} );

		} );

	}

}

/**
 * Texture Transform Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
 */
class GLTFTextureTransformExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

	}

	extendTexture( texture, transform ) {

		if ( ( transform.texCoord === undefined || transform.texCoord === texture.channel )
			&& transform.offset === undefined
			&& transform.rotation === undefined
			&& transform.scale === undefined ) {

			// See https://github.com/mrdoob/three.js/issues/21819.
			return texture;

		}

		texture = texture.clone();

		if ( transform.texCoord !== undefined ) {

			texture.channel = transform.texCoord;

		}

		if ( transform.offset !== undefined ) {

			texture.offset.fromArray( transform.offset );

		}

		if ( transform.rotation !== undefined ) {

			texture.rotation = transform.rotation;

		}

		if ( transform.scale !== undefined ) {

			texture.repeat.fromArray( transform.scale );

		}

		texture.needsUpdate = true;

		return texture;

	}

}

/**
 * Mesh Quantization Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
 */
class GLTFMeshQuantizationExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

	}

}

/*********************************/
/********** INTERPOLATION ********/
/*********************************/

// Spline Interpolation
// Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
class GLTFCubicSplineInterpolant extends Interpolant {

	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		super( parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	copySampleValue_( index ) {

		// Copies a sample value to the result buffer. See description of glTF
		// CUBICSPLINE values layout in interpolate_() function below.

		const result = this.resultBuffer,
			values = this.sampleValues,
			valueSize = this.valueSize,
			offset = index * valueSize * 3 + valueSize;

		for ( let i = 0; i !== valueSize; i ++ ) {

			result[ i ] = values[ offset + i ];

		}

		return result;

	}

	interpolate_( i1, t0, t, t1 ) {

		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;

		const stride2 = stride * 2;
		const stride3 = stride * 3;

		const td = t1 - t0;

		const p = ( t - t0 ) / td;
		const pp = p * p;
		const ppp = pp * p;

		const offset1 = i1 * stride3;
		const offset0 = offset1 - stride3;

		const s2 = - 2 * ppp + 3 * pp;
		const s3 = ppp - pp;
		const s0 = 1 - s2;
		const s1 = s3 - pp + p;

		// Layout of keyframe output values for CUBICSPLINE animations:
		//   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
		for ( let i = 0; i !== stride; i ++ ) {

			const p0 = values[ offset0 + i + stride ]; // splineVertex_k
			const m0 = values[ offset0 + i + stride2 ] * td; // outTangent_k * (t_k+1 - t_k)
			const p1 = values[ offset1 + i + stride ]; // splineVertex_k+1
			const m1 = values[ offset1 + i ] * td; // inTangent_k+1 * (t_k+1 - t_k)

			result[ i ] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

		}

		return result;

	}

}

const _q = new Quaternion();

class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {

	interpolate_( i1, t0, t, t1 ) {

		const result = super.interpolate_( i1, t0, t, t1 );

		_q.fromArray( result ).normalize().toArray( result );

		return result;

	}

}


/*********************************/
/********** INTERNALS ************/
/*********************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
	FLOAT: 5126,
	//FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
};

const WEBGL_COMPONENT_TYPES = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
};

const WEBGL_FILTERS = {
	9728: NearestFilter,
	9729: LinearFilter,
	9984: NearestMipmapNearestFilter,
	9985: LinearMipmapNearestFilter,
	9986: NearestMipmapLinearFilter,
	9987: LinearMipmapLinearFilter
};

const WEBGL_WRAPPINGS = {
	33071: ClampToEdgeWrapping,
	33648: MirroredRepeatWrapping,
	10497: RepeatWrapping
};

const WEBGL_TYPE_SIZES = {
	'SCALAR': 1,
	'VEC2': 2,
	'VEC3': 3,
	'VEC4': 4,
	'MAT2': 4,
	'MAT3': 9,
	'MAT4': 16
};

const ATTRIBUTES = {
	POSITION: 'position',
	NORMAL: 'normal',
	TANGENT: 'tangent',
	TEXCOORD_0: 'uv',
	TEXCOORD_1: 'uv1',
	TEXCOORD_2: 'uv2',
	TEXCOORD_3: 'uv3',
	COLOR_0: 'color',
	WEIGHTS_0: 'skinWeight',
	JOINTS_0: 'skinIndex',
};

const PATH_PROPERTIES = {
	scale: 'scale',
	translation: 'position',
	rotation: 'quaternion',
	weights: 'morphTargetInfluences'
};

const INTERPOLATION = {
	CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
		                        // keyframe track will be initialized with a default interpolation type, then modified.
	LINEAR: InterpolateLinear,
	STEP: InterpolateDiscrete
};

const ALPHA_MODES = {
	OPAQUE: 'OPAQUE',
	MASK: 'MASK',
	BLEND: 'BLEND'
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 */
function createDefaultMaterial( cache ) {

	if ( cache[ 'DefaultMaterial' ] === undefined ) {

		cache[ 'DefaultMaterial' ] = new MeshStandardMaterial( {
			color: 0xFFFFFF,
			emissive: 0x000000,
			metalness: 1,
			roughness: 1,
			transparent: false,
			depthTest: true,
			side: FrontSide
		} );

	}

	return cache[ 'DefaultMaterial' ];

}

function addUnknownExtensionsToUserData( knownExtensions, object, objectDef ) {

	// Add unknown glTF extensions to an object's userData.

	for ( const name in objectDef.extensions ) {

		if ( knownExtensions[ name ] === undefined ) {

			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
			object.userData.gltfExtensions[ name ] = objectDef.extensions[ name ];

		}

	}

}

/**
 * @param {Object3D|Material|BufferGeometry} object
 * @param {GLTF.definition} gltfDef
 */
function assignExtrasToUserData( object, gltfDef ) {

	if ( gltfDef.extras !== undefined ) {

		if ( typeof gltfDef.extras === 'object' ) {

			Object.assign( object.userData, gltfDef.extras );

		} else {

			console.warn( 'THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras );

		}

	}

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 * @param {BufferGeometry} geometry
 * @param {Array<GLTF.Target>} targets
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addMorphTargets( geometry, targets, parser ) {

	let hasMorphPosition = false;
	let hasMorphNormal = false;
	let hasMorphColor = false;

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( target.POSITION !== undefined ) hasMorphPosition = true;
		if ( target.NORMAL !== undefined ) hasMorphNormal = true;
		if ( target.COLOR_0 !== undefined ) hasMorphColor = true;

		if ( hasMorphPosition && hasMorphNormal && hasMorphColor ) break;

	}

	if ( ! hasMorphPosition && ! hasMorphNormal && ! hasMorphColor ) return Promise.resolve( geometry );

	const pendingPositionAccessors = [];
	const pendingNormalAccessors = [];
	const pendingColorAccessors = [];

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( hasMorphPosition ) {

			const pendingAccessor = target.POSITION !== undefined
				? parser.getDependency( 'accessor', target.POSITION )
				: geometry.attributes.position;

			pendingPositionAccessors.push( pendingAccessor );

		}

		if ( hasMorphNormal ) {

			const pendingAccessor = target.NORMAL !== undefined
				? parser.getDependency( 'accessor', target.NORMAL )
				: geometry.attributes.normal;

			pendingNormalAccessors.push( pendingAccessor );

		}

		if ( hasMorphColor ) {

			const pendingAccessor = target.COLOR_0 !== undefined
				? parser.getDependency( 'accessor', target.COLOR_0 )
				: geometry.attributes.color;

			pendingColorAccessors.push( pendingAccessor );

		}

	}

	return Promise.all( [
		Promise.all( pendingPositionAccessors ),
		Promise.all( pendingNormalAccessors ),
		Promise.all( pendingColorAccessors )
	] ).then( function ( accessors ) {

		const morphPositions = accessors[ 0 ];
		const morphNormals = accessors[ 1 ];
		const morphColors = accessors[ 2 ];

		if ( hasMorphPosition ) geometry.morphAttributes.position = morphPositions;
		if ( hasMorphNormal ) geometry.morphAttributes.normal = morphNormals;
		if ( hasMorphColor ) geometry.morphAttributes.color = morphColors;
		geometry.morphTargetsRelative = true;

		return geometry;

	} );

}

/**
 * @param {Mesh} mesh
 * @param {GLTF.Mesh} meshDef
 */
function updateMorphTargets( mesh, meshDef ) {

	mesh.updateMorphTargets();

	if ( meshDef.weights !== undefined ) {

		for ( let i = 0, il = meshDef.weights.length; i < il; i ++ ) {

			mesh.morphTargetInfluences[ i ] = meshDef.weights[ i ];

		}

	}

	// .extras has user-defined data, so check that .extras.targetNames is an array.
	if ( meshDef.extras && Array.isArray( meshDef.extras.targetNames ) ) {

		const targetNames = meshDef.extras.targetNames;

		if ( mesh.morphTargetInfluences.length === targetNames.length ) {

			mesh.morphTargetDictionary = {};

			for ( let i = 0, il = targetNames.length; i < il; i ++ ) {

				mesh.morphTargetDictionary[ targetNames[ i ] ] = i;

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.' );

		}

	}

}

function createPrimitiveKey( primitiveDef ) {

	let geometryKey;

	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ];

	if ( dracoExtension ) {

		geometryKey = 'draco:' + dracoExtension.bufferView
				+ ':' + dracoExtension.indices
				+ ':' + createAttributesKey( dracoExtension.attributes );

	} else {

		geometryKey = primitiveDef.indices + ':' + createAttributesKey( primitiveDef.attributes ) + ':' + primitiveDef.mode;

	}

	if ( primitiveDef.targets !== undefined ) {

		for ( let i = 0, il = primitiveDef.targets.length; i < il; i ++ ) {

			geometryKey += ':' + createAttributesKey( primitiveDef.targets[ i ] );

		}

	}

	return geometryKey;

}

function createAttributesKey( attributes ) {

	let attributesKey = '';

	const keys = Object.keys( attributes ).sort();

	for ( let i = 0, il = keys.length; i < il; i ++ ) {

		attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

	}

	return attributesKey;

}

function getNormalizedComponentScale( constructor ) {

	// Reference:
	// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

	switch ( constructor ) {

		case Int8Array:
			return 1 / 127;

		case Uint8Array:
			return 1 / 255;

		case Int16Array:
			return 1 / 32767;

		case Uint16Array:
			return 1 / 65535;

		default:
			throw new Error( 'THREE.GLTFLoader: Unsupported normalized accessor component type.' );

	}

}

function getImageURIMimeType( uri ) {

	if ( uri.search( /\.jpe?g($|\?)/i ) > 0 || uri.search( /^data\:image\/jpeg/ ) === 0 ) return 'image/jpeg';
	if ( uri.search( /\.webp($|\?)/i ) > 0 || uri.search( /^data\:image\/webp/ ) === 0 ) return 'image/webp';

	return 'image/png';

}

const _identityMatrix = new Matrix4();

/* GLTF PARSER */

class GLTFParser {

	constructor( json = {}, options = {} ) {

		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between Three.js objects and glTF elements
		this.associations = new Map();

		// BufferGeometry caching
		this.primitiveCache = {};

		// Node cache
		this.nodeCache = {};

		// Object3D instance caches
		this.meshCache = { refs: {}, uses: {} };
		this.cameraCache = { refs: {}, uses: {} };
		this.lightCache = { refs: {}, uses: {} };

		this.sourceCache = {};
		this.textureCache = {};

		// Track node names, to ensure no duplicates
		this.nodeNamesUsed = {};

		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
		// expensive work of uploading a texture to the GPU off the main thread.

		let isSafari = false;
		let isFirefox = false;
		let firefoxVersion = - 1;

		if ( typeof navigator !== 'undefined' ) {

			isSafari = /^((?!chrome|android).)*safari/i.test( navigator.userAgent ) === true;
			isFirefox = navigator.userAgent.indexOf( 'Firefox' ) > - 1;
			firefoxVersion = isFirefox ? navigator.userAgent.match( /Firefox\/([0-9]+)\./ )[ 1 ] : - 1;

		}

		if ( typeof createImageBitmap === 'undefined' || isSafari || ( isFirefox && firefoxVersion < 98 ) ) {

			this.textureLoader = new TextureLoader( this.options.manager );

		} else {

			this.textureLoader = new ImageBitmapLoader( this.options.manager );

		}

		this.textureLoader.setCrossOrigin( this.options.crossOrigin );
		this.textureLoader.setRequestHeader( this.options.requestHeader );

		this.fileLoader = new FileLoader( this.options.manager );
		this.fileLoader.setResponseType( 'arraybuffer' );

		if ( this.options.crossOrigin === 'use-credentials' ) {

			this.fileLoader.setWithCredentials( true );

		}

	}

	setExtensions( extensions ) {

		this.extensions = extensions;

	}

	setPlugins( plugins ) {

		this.plugins = plugins;

	}

	parse( onLoad, onError ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		// Clear the loader cache
		this.cache.removeAll();
		this.nodeCache = {};

		// Mark the special nodes/meshes in json for efficient parse
		this._invokeAll( function ( ext ) {

			return ext._markDefs && ext._markDefs();

		} );

		Promise.all( this._invokeAll( function ( ext ) {

			return ext.beforeRoot && ext.beforeRoot();

		} ) ).then( function () {

			return Promise.all( [

				parser.getDependencies( 'scene' ),
				parser.getDependencies( 'animation' ),
				parser.getDependencies( 'camera' ),

			] );

		} ).then( function ( dependencies ) {

			const result = {
				scene: dependencies[ 0 ][ json.scene || 0 ],
				scenes: dependencies[ 0 ],
				animations: dependencies[ 1 ],
				cameras: dependencies[ 2 ],
				asset: json.asset,
				parser: parser,
				userData: {}
			};

			addUnknownExtensionsToUserData( extensions, result, json );

			assignExtrasToUserData( result, json );

			return Promise.all( parser._invokeAll( function ( ext ) {

				return ext.afterRoot && ext.afterRoot( result );

			} ) ).then( function () {

				onLoad( result );

			} );

		} ).catch( onError );

	}

	/**
	 * Marks the special nodes/meshes in json for efficient parse.
	 */
	_markDefs() {

		const nodeDefs = this.json.nodes || [];
		const skinDefs = this.json.skins || [];
		const meshDefs = this.json.meshes || [];

		// Nothing in the node definition indicates whether it is a Bone or an
		// Object3D. Use the skins' joint references to mark bones.
		for ( let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex ++ ) {

			const joints = skinDefs[ skinIndex ].joints;

			for ( let i = 0, il = joints.length; i < il; i ++ ) {

				nodeDefs[ joints[ i ] ].isBone = true;

			}

		}

		// Iterate over all nodes, marking references to shared resources,
		// as well as skeleton joints.
		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.mesh !== undefined ) {

				this._addNodeRef( this.meshCache, nodeDef.mesh );

				// Nothing in the mesh definition indicates whether it is
				// a SkinnedMesh or Mesh. Use the node's mesh reference
				// to mark SkinnedMesh if node has skin.
				if ( nodeDef.skin !== undefined ) {

					meshDefs[ nodeDef.mesh ].isSkinnedMesh = true;

				}

			}

			if ( nodeDef.camera !== undefined ) {

				this._addNodeRef( this.cameraCache, nodeDef.camera );

			}

		}

	}

	/**
	 * Counts references to shared node / Object3D resources. These resources
	 * can be reused, or "instantiated", at multiple nodes in the scene
	 * hierarchy. Mesh, Camera, and Light instances are instantiated and must
	 * be marked. Non-scenegraph resources (like Materials, Geometries, and
	 * Textures) can be reused directly and are not marked here.
	 *
	 * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
	 */
	_addNodeRef( cache, index ) {

		if ( index === undefined ) return;

		if ( cache.refs[ index ] === undefined ) {

			cache.refs[ index ] = cache.uses[ index ] = 0;

		}

		cache.refs[ index ] ++;

	}

	/** Returns a reference to a shared resource, cloning it if necessary. */
	_getNodeRef( cache, index, object ) {

		if ( cache.refs[ index ] <= 1 ) return object;

		const ref = object.clone();

		// Propagates mappings to the cloned object, prevents mappings on the
		// original object from being lost.
		const updateMappings = ( original, clone ) => {

			const mappings = this.associations.get( original );
			if ( mappings != null ) {

				this.associations.set( clone, mappings );

			}

			for ( const [ i, child ] of original.children.entries() ) {

				updateMappings( child, clone.children[ i ] );

			}

		};

		updateMappings( object, ref );

		ref.name += '_instance_' + ( cache.uses[ index ] ++ );

		return ref;

	}

	_invokeOne( func ) {

		const extensions = Object.values( this.plugins );
		extensions.push( this );

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) return result;

		}

		return null;

	}

	_invokeAll( func ) {

		const extensions = Object.values( this.plugins );
		extensions.unshift( this );

		const pending = [];

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) pending.push( result );

		}

		return pending;

	}

	/**
	 * Requests the specified dependency asynchronously, with caching.
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
	 */
	getDependency( type, index ) {

		const cacheKey = type + ':' + index;
		let dependency = this.cache.get( cacheKey );

		if ( ! dependency ) {

			switch ( type ) {

				case 'scene':
					dependency = this.loadScene( index );
					break;

				case 'node':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadNode && ext.loadNode( index );

					} );
					break;

				case 'mesh':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMesh && ext.loadMesh( index );

					} );
					break;

				case 'accessor':
					dependency = this.loadAccessor( index );
					break;

				case 'bufferView':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadBufferView && ext.loadBufferView( index );

					} );
					break;

				case 'buffer':
					dependency = this.loadBuffer( index );
					break;

				case 'material':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMaterial && ext.loadMaterial( index );

					} );
					break;

				case 'texture':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadTexture && ext.loadTexture( index );

					} );
					break;

				case 'skin':
					dependency = this.loadSkin( index );
					break;

				case 'animation':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadAnimation && ext.loadAnimation( index );

					} );
					break;

				case 'camera':
					dependency = this.loadCamera( index );
					break;

				default:
					dependency = this._invokeOne( function ( ext ) {

						return ext != this && ext.getDependency && ext.getDependency( type, index );

					} );

					if ( ! dependency ) {

						throw new Error( 'Unknown type: ' + type );

					}

					break;

			}

			this.cache.add( cacheKey, dependency );

		}

		return dependency;

	}

	/**
	 * Requests all dependencies of the specified type asynchronously, with caching.
	 * @param {string} type
	 * @return {Promise<Array<Object>>}
	 */
	getDependencies( type ) {

		let dependencies = this.cache.get( type );

		if ( ! dependencies ) {

			const parser = this;
			const defs = this.json[ type + ( type === 'mesh' ? 'es' : 's' ) ] || [];

			dependencies = Promise.all( defs.map( function ( def, index ) {

				return parser.getDependency( type, index );

			} ) );

			this.cache.add( type, dependencies );

		}

		return dependencies;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBuffer( bufferIndex ) {

		const bufferDef = this.json.buffers[ bufferIndex ];
		const loader = this.fileLoader;

		if ( bufferDef.type && bufferDef.type !== 'arraybuffer' ) {

			throw new Error( 'THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.' );

		}

		// If present, GLB container is required to be the first buffer.
		if ( bufferDef.uri === undefined && bufferIndex === 0 ) {

			return Promise.resolve( this.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body );

		}

		const options = this.options;

		return new Promise( function ( resolve, reject ) {

			loader.load( LoaderUtils.resolveURL( bufferDef.uri, options.path ), resolve, undefined, function () {

				reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

			} );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBufferView( bufferViewIndex ) {

		const bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

		return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

			const byteLength = bufferViewDef.byteLength || 0;
			const byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice( byteOffset, byteOffset + byteLength );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
	 */
	loadAccessor( accessorIndex ) {

		const parser = this;
		const json = this.json;

		const accessorDef = this.json.accessors[ accessorIndex ];

		if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];
			const normalized = accessorDef.normalized === true;

			const array = new TypedArray( accessorDef.count * itemSize );
			return Promise.resolve( new BufferAttribute( array, itemSize, normalized ) );

		}

		const pendingBufferViews = [];

		if ( accessorDef.bufferView !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

		} else {

			pendingBufferViews.push( null );

		}

		if ( accessorDef.sparse !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

		}

		return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

			const bufferView = bufferViews[ 0 ];

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
			const itemBytes = elementBytes * itemSize;
			const byteOffset = accessorDef.byteOffset || 0;
			const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;
			const normalized = accessorDef.normalized === true;
			let array, bufferAttribute;

			// The buffer is not interleaved if the stride is the item size in bytes.
			if ( byteStride && byteStride !== itemBytes ) {

				// Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
				// This makes sure that IBA.count reflects accessor.count properly
				const ibSlice = Math.floor( byteOffset / byteStride );
				const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
				let ib = parser.cache.get( ibCacheKey );

				if ( ! ib ) {

					array = new TypedArray( bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes );

					// Integer parameters to IB/IBA are in array elements, not bytes.
					ib = new InterleavedBuffer( array, byteStride / elementBytes );

					parser.cache.add( ibCacheKey, ib );

				}

				bufferAttribute = new InterleavedBufferAttribute( ib, itemSize, ( byteOffset % byteStride ) / elementBytes, normalized );

			} else {

				if ( bufferView === null ) {

					array = new TypedArray( accessorDef.count * itemSize );

				} else {

					array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

				}

				bufferAttribute = new BufferAttribute( array, itemSize, normalized );

			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if ( accessorDef.sparse !== undefined ) {

				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				const sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
				const sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

				if ( bufferView !== null ) {

					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
					bufferAttribute = new BufferAttribute( bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized );

				}

				for ( let i = 0, il = sparseIndices.length; i < il; i ++ ) {

					const index = sparseIndices[ i ];

					bufferAttribute.setX( index, sparseValues[ i * itemSize ] );
					if ( itemSize >= 2 ) bufferAttribute.setY( index, sparseValues[ i * itemSize + 1 ] );
					if ( itemSize >= 3 ) bufferAttribute.setZ( index, sparseValues[ i * itemSize + 2 ] );
					if ( itemSize >= 4 ) bufferAttribute.setW( index, sparseValues[ i * itemSize + 3 ] );
					if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

				}

			}

			return bufferAttribute;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 * @param {number} textureIndex
	 * @return {Promise<THREE.Texture|null>}
	 */
	loadTexture( textureIndex ) {

		const json = this.json;
		const options = this.options;
		const textureDef = json.textures[ textureIndex ];
		const sourceIndex = textureDef.source;
		const sourceDef = json.images[ sourceIndex ];

		let loader = this.textureLoader;

		if ( sourceDef.uri ) {

			const handler = options.manager.getHandler( sourceDef.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.loadTextureImage( textureIndex, sourceIndex, loader );

	}

	loadTextureImage( textureIndex, sourceIndex, loader ) {

		const parser = this;
		const json = this.json;

		const textureDef = json.textures[ textureIndex ];
		const sourceDef = json.images[ sourceIndex ];

		const cacheKey = ( sourceDef.uri || sourceDef.bufferView ) + ':' + textureDef.sampler;

		if ( this.textureCache[ cacheKey ] ) {

			// See https://github.com/mrdoob/three.js/issues/21559.
			return this.textureCache[ cacheKey ];

		}

		const promise = this.loadImageSource( sourceIndex, loader ).then( function ( texture ) {

			texture.flipY = false;

			texture.name = textureDef.name || sourceDef.name || '';

			if ( texture.name === '' && typeof sourceDef.uri === 'string' && sourceDef.uri.startsWith( 'data:image/' ) === false ) {

				texture.name = sourceDef.uri;

			}

			const samplers = json.samplers || {};
			const sampler = samplers[ textureDef.sampler ] || {};

			texture.magFilter = WEBGL_FILTERS[ sampler.magFilter ] || LinearFilter;
			texture.minFilter = WEBGL_FILTERS[ sampler.minFilter ] || LinearMipmapLinearFilter;
			texture.wrapS = WEBGL_WRAPPINGS[ sampler.wrapS ] || RepeatWrapping;
			texture.wrapT = WEBGL_WRAPPINGS[ sampler.wrapT ] || RepeatWrapping;

			parser.associations.set( texture, { textures: textureIndex } );

			return texture;

		} ).catch( function () {

			return null;

		} );

		this.textureCache[ cacheKey ] = promise;

		return promise;

	}

	loadImageSource( sourceIndex, loader ) {

		const parser = this;
		const json = this.json;
		const options = this.options;

		if ( this.sourceCache[ sourceIndex ] !== undefined ) {

			return this.sourceCache[ sourceIndex ].then( ( texture ) => texture.clone() );

		}

		const sourceDef = json.images[ sourceIndex ];

		const URL = self.URL || self.webkitURL;

		let sourceURI = sourceDef.uri || '';
		let isObjectURL = false;

		if ( sourceDef.bufferView !== undefined ) {

			// Load binary image data from bufferView, if provided.

			sourceURI = parser.getDependency( 'bufferView', sourceDef.bufferView ).then( function ( bufferView ) {

				isObjectURL = true;
				const blob = new Blob( [ bufferView ], { type: sourceDef.mimeType } );
				sourceURI = URL.createObjectURL( blob );
				return sourceURI;

			} );

		} else if ( sourceDef.uri === undefined ) {

			throw new Error( 'THREE.GLTFLoader: Image ' + sourceIndex + ' is missing URI and bufferView' );

		}

		const promise = Promise.resolve( sourceURI ).then( function ( sourceURI ) {

			return new Promise( function ( resolve, reject ) {

				let onLoad = resolve;

				if ( loader.isImageBitmapLoader === true ) {

					onLoad = function ( imageBitmap ) {

						const texture = new Texture( imageBitmap );
						texture.needsUpdate = true;

						resolve( texture );

					};

				}

				loader.load( LoaderUtils.resolveURL( sourceURI, options.path ), onLoad, undefined, reject );

			} );

		} ).then( function ( texture ) {

			// Clean up resources and configure Texture.

			if ( isObjectURL === true ) {

				URL.revokeObjectURL( sourceURI );

			}

			texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType( sourceDef.uri );

			return texture;

		} ).catch( function ( error ) {

			console.error( 'THREE.GLTFLoader: Couldn\'t load texture', sourceURI );
			throw error;

		} );

		this.sourceCache[ sourceIndex ] = promise;
		return promise;

	}

	/**
	 * Asynchronously assigns a texture to the given material parameters.
	 * @param {Object} materialParams
	 * @param {string} mapName
	 * @param {Object} mapDef
	 * @return {Promise<Texture>}
	 */
	assignTexture( materialParams, mapName, mapDef, colorSpace ) {

		const parser = this;

		return this.getDependency( 'texture', mapDef.index ).then( function ( texture ) {

			if ( ! texture ) return null;

			if ( mapDef.texCoord !== undefined && mapDef.texCoord > 0 ) {

				texture = texture.clone();
				texture.channel = mapDef.texCoord;

			}

			if ( parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] ) {

				const transform = mapDef.extensions !== undefined ? mapDef.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] : undefined;

				if ( transform ) {

					const gltfReference = parser.associations.get( texture );
					texture = parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ].extendTexture( texture, transform );
					parser.associations.set( texture, gltfReference );

				}

			}

			if ( colorSpace !== undefined ) {

				texture.colorSpace = colorSpace;

			}

			materialParams[ mapName ] = texture;

			return texture;

		} );

	}

	/**
	 * Assigns final material to a Mesh, Line, or Points instance. The instance
	 * already has a material (generated from the glTF material options alone)
	 * but reuse of the same glTF material may require multiple threejs materials
	 * to accommodate different primitive types, defines, etc. New materials will
	 * be created if necessary, and reused from a cache.
	 * @param  {Object3D} mesh Mesh, Line, or Points instance.
	 */
	assignFinalMaterial( mesh ) {

		const geometry = mesh.geometry;
		let material = mesh.material;

		const useDerivativeTangents = geometry.attributes.tangent === undefined;
		const useVertexColors = geometry.attributes.color !== undefined;
		const useFlatShading = geometry.attributes.normal === undefined;

		if ( mesh.isPoints ) {

			const cacheKey = 'PointsMaterial:' + material.uuid;

			let pointsMaterial = this.cache.get( cacheKey );

			if ( ! pointsMaterial ) {

				pointsMaterial = new PointsMaterial();
				Material.prototype.copy.call( pointsMaterial, material );
				pointsMaterial.color.copy( material.color );
				pointsMaterial.map = material.map;
				pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

				this.cache.add( cacheKey, pointsMaterial );

			}

			material = pointsMaterial;

		} else if ( mesh.isLine ) {

			const cacheKey = 'LineBasicMaterial:' + material.uuid;

			let lineMaterial = this.cache.get( cacheKey );

			if ( ! lineMaterial ) {

				lineMaterial = new LineBasicMaterial();
				Material.prototype.copy.call( lineMaterial, material );
				lineMaterial.color.copy( material.color );
				lineMaterial.map = material.map;

				this.cache.add( cacheKey, lineMaterial );

			}

			material = lineMaterial;

		}

		// Clone the material if it will be modified
		if ( useDerivativeTangents || useVertexColors || useFlatShading ) {

			let cacheKey = 'ClonedMaterial:' + material.uuid + ':';

			if ( useDerivativeTangents ) cacheKey += 'derivative-tangents:';
			if ( useVertexColors ) cacheKey += 'vertex-colors:';
			if ( useFlatShading ) cacheKey += 'flat-shading:';

			let cachedMaterial = this.cache.get( cacheKey );

			if ( ! cachedMaterial ) {

				cachedMaterial = material.clone();

				if ( useVertexColors ) cachedMaterial.vertexColors = true;
				if ( useFlatShading ) cachedMaterial.flatShading = true;

				if ( useDerivativeTangents ) {

					// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
					if ( cachedMaterial.normalScale ) cachedMaterial.normalScale.y *= - 1;
					if ( cachedMaterial.clearcoatNormalScale ) cachedMaterial.clearcoatNormalScale.y *= - 1;

				}

				this.cache.add( cacheKey, cachedMaterial );

				this.associations.set( cachedMaterial, this.associations.get( material ) );

			}

			material = cachedMaterial;

		}

		mesh.material = material;

	}

	getMaterialType( /* materialIndex */ ) {

		return MeshStandardMaterial;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
	 * @return {Promise<Material>}
	 */
	loadMaterial( materialIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const materialDef = json.materials[ materialIndex ];

		let materialType;
		const materialParams = {};
		const materialExtensions = materialDef.extensions || {};

		const pending = [];

		if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ] ) {

			const kmuExtension = extensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ];
			materialType = kmuExtension.getMaterialType();
			pending.push( kmuExtension.extendParams( materialParams, materialDef, parser ) );

		} else {

			// Specification:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

			const metallicRoughness = materialDef.pbrMetallicRoughness || {};

			materialParams.color = new Color( 1.0, 1.0, 1.0 );
			materialParams.opacity = 1.0;

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.setRGB( array[ 0 ], array[ 1 ], array[ 2 ], LinearSRGBColorSpace );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace ) );

			}

			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

			if ( metallicRoughness.metallicRoughnessTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture ) );
				pending.push( parser.assignTexture( materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture ) );

			}

			materialType = this._invokeOne( function ( ext ) {

				return ext.getMaterialType && ext.getMaterialType( materialIndex );

			} );

			pending.push( Promise.all( this._invokeAll( function ( ext ) {

				return ext.extendMaterialParams && ext.extendMaterialParams( materialIndex, materialParams );

			} ) ) );

		}

		if ( materialDef.doubleSided === true ) {

			materialParams.side = DoubleSide;

		}

		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

		if ( alphaMode === ALPHA_MODES.BLEND ) {

			materialParams.transparent = true;

			// See: https://github.com/mrdoob/three.js/issues/17706
			materialParams.depthWrite = false;

		} else {

			materialParams.transparent = false;

			if ( alphaMode === ALPHA_MODES.MASK ) {

				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;

			}

		}

		if ( materialDef.normalTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'normalMap', materialDef.normalTexture ) );

			materialParams.normalScale = new Vector2( 1, 1 );

			if ( materialDef.normalTexture.scale !== undefined ) {

				const scale = materialDef.normalTexture.scale;

				materialParams.normalScale.set( scale, scale );

			}

		}

		if ( materialDef.occlusionTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'aoMap', materialDef.occlusionTexture ) );

			if ( materialDef.occlusionTexture.strength !== undefined ) {

				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;

			}

		}

		if ( materialDef.emissiveFactor !== undefined && materialType !== MeshBasicMaterial ) {

			const emissiveFactor = materialDef.emissiveFactor;
			materialParams.emissive = new Color().setRGB( emissiveFactor[ 0 ], emissiveFactor[ 1 ], emissiveFactor[ 2 ], LinearSRGBColorSpace );

		}

		if ( materialDef.emissiveTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'emissiveMap', materialDef.emissiveTexture, SRGBColorSpace ) );

		}

		return Promise.all( pending ).then( function () {

			const material = new materialType( materialParams );

			if ( materialDef.name ) material.name = materialDef.name;

			assignExtrasToUserData( material, materialDef );

			parser.associations.set( material, { materials: materialIndex } );

			if ( materialDef.extensions ) addUnknownExtensionsToUserData( extensions, material, materialDef );

			return material;

		} );

	}

	/** When Object3D instances are targeted by animation, they need unique names. */
	createUniqueName( originalName ) {

		const sanitizedName = PropertyBinding.sanitizeNodeName( originalName || '' );

		if ( sanitizedName in this.nodeNamesUsed ) {

			return sanitizedName + '_' + ( ++ this.nodeNamesUsed[ sanitizedName ] );

		} else {

			this.nodeNamesUsed[ sanitizedName ] = 0;

			return sanitizedName;

		}

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 *
	 * Creates BufferGeometries from primitives.
	 *
	 * @param {Array<GLTF.Primitive>} primitives
	 * @return {Promise<Array<BufferGeometry>>}
	 */
	loadGeometries( primitives ) {

		const parser = this;
		const extensions = this.extensions;
		const cache = this.primitiveCache;

		function createDracoPrimitive( primitive ) {

			return extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ]
				.decodePrimitive( primitive, parser )
				.then( function ( geometry ) {

					return addPrimitiveAttributes( geometry, primitive, parser );

				} );

		}

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const primitive = primitives[ i ];
			const cacheKey = createPrimitiveKey( primitive );

			// See if we've already created this geometry
			const cached = cache[ cacheKey ];

			if ( cached ) {

				// Use the cached geometry if it exists
				pending.push( cached.promise );

			} else {

				let geometryPromise;

				if ( primitive.extensions && primitive.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ] ) {

					// Use DRACO geometry if available
					geometryPromise = createDracoPrimitive( primitive );

				} else {

					// Otherwise create a new geometry
					geometryPromise = addPrimitiveAttributes( new BufferGeometry(), primitive, parser );

				}

				// Cache this geometry
				cache[ cacheKey ] = { primitive: primitive, promise: geometryPromise };

				pending.push( geometryPromise );

			}

		}

		return Promise.all( pending );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
	 * @param {number} meshIndex
	 * @return {Promise<Group|Mesh|SkinnedMesh>}
	 */
	loadMesh( meshIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		const meshDef = json.meshes[ meshIndex ];
		const primitives = meshDef.primitives;

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const material = primitives[ i ].material === undefined
				? createDefaultMaterial( this.cache )
				: this.getDependency( 'material', primitives[ i ].material );

			pending.push( material );

		}

		pending.push( parser.loadGeometries( primitives ) );

		return Promise.all( pending ).then( function ( results ) {

			const materials = results.slice( 0, results.length - 1 );
			const geometries = results[ results.length - 1 ];

			const meshes = [];

			for ( let i = 0, il = geometries.length; i < il; i ++ ) {

				const geometry = geometries[ i ];
				const primitive = primitives[ i ];

				// 1. create Mesh

				let mesh;

				const material = materials[ i ];

				if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
						primitive.mode === undefined ) {

					// .isSkinnedMesh isn't in glTF spec. See ._markDefs()
					mesh = meshDef.isSkinnedMesh === true
						? new SkinnedMesh( geometry, material )
						: new Mesh( geometry, material );

					if ( mesh.isSkinnedMesh === true ) {

						// normalize skin weights to fix malformed assets (see #15319)
						mesh.normalizeSkinWeights();

					}

					if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleStripDrawMode );

					} else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleFanDrawMode );

					}

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

					mesh = new LineSegments( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

					mesh = new Line( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

					mesh = new LineLoop( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

					mesh = new Points( geometry, material );

				} else {

					throw new Error( 'THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode );

				}

				if ( Object.keys( mesh.geometry.morphAttributes ).length > 0 ) {

					updateMorphTargets( mesh, meshDef );

				}

				mesh.name = parser.createUniqueName( meshDef.name || ( 'mesh_' + meshIndex ) );

				assignExtrasToUserData( mesh, meshDef );

				if ( primitive.extensions ) addUnknownExtensionsToUserData( extensions, mesh, primitive );

				parser.assignFinalMaterial( mesh );

				meshes.push( mesh );

			}

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				parser.associations.set( meshes[ i ], {
					meshes: meshIndex,
					primitives: i
				} );

			}

			if ( meshes.length === 1 ) {

				if ( meshDef.extensions ) addUnknownExtensionsToUserData( extensions, meshes[ 0 ], meshDef );

				return meshes[ 0 ];

			}

			const group = new Group();

			if ( meshDef.extensions ) addUnknownExtensionsToUserData( extensions, group, meshDef );

			parser.associations.set( group, { meshes: meshIndex } );

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				group.add( meshes[ i ] );

			}

			return group;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 * @param {number} cameraIndex
	 * @return {Promise<THREE.Camera>}
	 */
	loadCamera( cameraIndex ) {

		let camera;
		const cameraDef = this.json.cameras[ cameraIndex ];
		const params = cameraDef[ cameraDef.type ];

		if ( ! params ) {

			console.warn( 'THREE.GLTFLoader: Missing camera parameters.' );
			return;

		}

		if ( cameraDef.type === 'perspective' ) {

			camera = new PerspectiveCamera( MathUtils.radToDeg( params.yfov ), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6 );

		} else if ( cameraDef.type === 'orthographic' ) {

			camera = new OrthographicCamera( - params.xmag, params.xmag, params.ymag, - params.ymag, params.znear, params.zfar );

		}

		if ( cameraDef.name ) camera.name = this.createUniqueName( cameraDef.name );

		assignExtrasToUserData( camera, cameraDef );

		return Promise.resolve( camera );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 * @param {number} skinIndex
	 * @return {Promise<Skeleton>}
	 */
	loadSkin( skinIndex ) {

		const skinDef = this.json.skins[ skinIndex ];

		const pending = [];

		for ( let i = 0, il = skinDef.joints.length; i < il; i ++ ) {

			pending.push( this._loadNodeShallow( skinDef.joints[ i ] ) );

		}

		if ( skinDef.inverseBindMatrices !== undefined ) {

			pending.push( this.getDependency( 'accessor', skinDef.inverseBindMatrices ) );

		} else {

			pending.push( null );

		}

		return Promise.all( pending ).then( function ( results ) {

			const inverseBindMatrices = results.pop();
			const jointNodes = results;

			// Note that bones (joint nodes) may or may not be in the
			// scene graph at this time.

			const bones = [];
			const boneInverses = [];

			for ( let i = 0, il = jointNodes.length; i < il; i ++ ) {

				const jointNode = jointNodes[ i ];

				if ( jointNode ) {

					bones.push( jointNode );

					const mat = new Matrix4();

					if ( inverseBindMatrices !== null ) {

						mat.fromArray( inverseBindMatrices.array, i * 16 );

					}

					boneInverses.push( mat );

				} else {

					console.warn( 'THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[ i ] );

				}

			}

			return new Skeleton( bones, boneInverses );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 * @param {number} animationIndex
	 * @return {Promise<AnimationClip>}
	 */
	loadAnimation( animationIndex ) {

		const json = this.json;
		const parser = this;

		const animationDef = json.animations[ animationIndex ];
		const animationName = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

		const pendingNodes = [];
		const pendingInputAccessors = [];
		const pendingOutputAccessors = [];
		const pendingSamplers = [];
		const pendingTargets = [];

		for ( let i = 0, il = animationDef.channels.length; i < il; i ++ ) {

			const channel = animationDef.channels[ i ];
			const sampler = animationDef.samplers[ channel.sampler ];
			const target = channel.target;
			const name = target.node;
			const input = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.input ] : sampler.input;
			const output = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.output ] : sampler.output;

			if ( target.node === undefined ) continue;

			pendingNodes.push( this.getDependency( 'node', name ) );
			pendingInputAccessors.push( this.getDependency( 'accessor', input ) );
			pendingOutputAccessors.push( this.getDependency( 'accessor', output ) );
			pendingSamplers.push( sampler );
			pendingTargets.push( target );

		}

		return Promise.all( [

			Promise.all( pendingNodes ),
			Promise.all( pendingInputAccessors ),
			Promise.all( pendingOutputAccessors ),
			Promise.all( pendingSamplers ),
			Promise.all( pendingTargets )

		] ).then( function ( dependencies ) {

			const nodes = dependencies[ 0 ];
			const inputAccessors = dependencies[ 1 ];
			const outputAccessors = dependencies[ 2 ];
			const samplers = dependencies[ 3 ];
			const targets = dependencies[ 4 ];

			const tracks = [];

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				const node = nodes[ i ];
				const inputAccessor = inputAccessors[ i ];
				const outputAccessor = outputAccessors[ i ];
				const sampler = samplers[ i ];
				const target = targets[ i ];

				if ( node === undefined ) continue;

				if ( node.updateMatrix ) {

					node.updateMatrix();

				}

				const createdTracks = parser._createAnimationTracks( node, inputAccessor, outputAccessor, sampler, target );

				if ( createdTracks ) {

					for ( let k = 0; k < createdTracks.length; k ++ ) {

						tracks.push( createdTracks[ k ] );

					}

				}

			}

			return new AnimationClip( animationName, undefined, tracks );

		} );

	}

	createNodeMesh( nodeIndex ) {

		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( nodeDef.mesh === undefined ) return null;

		return parser.getDependency( 'mesh', nodeDef.mesh ).then( function ( mesh ) {

			const node = parser._getNodeRef( parser.meshCache, nodeDef.mesh, mesh );

			// if weights are provided on the node, override weights on the mesh.
			if ( nodeDef.weights !== undefined ) {

				node.traverse( function ( o ) {

					if ( ! o.isMesh ) return;

					for ( let i = 0, il = nodeDef.weights.length; i < il; i ++ ) {

						o.morphTargetInfluences[ i ] = nodeDef.weights[ i ];

					}

				} );

			}

			return node;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 * @param {number} nodeIndex
	 * @return {Promise<Object3D>}
	 */
	loadNode( nodeIndex ) {

		const json = this.json;
		const parser = this;

		const nodeDef = json.nodes[ nodeIndex ];

		const nodePending = parser._loadNodeShallow( nodeIndex );

		const childPending = [];
		const childrenDef = nodeDef.children || [];

		for ( let i = 0, il = childrenDef.length; i < il; i ++ ) {

			childPending.push( parser.getDependency( 'node', childrenDef[ i ] ) );

		}

		const skeletonPending = nodeDef.skin === undefined
			? Promise.resolve( null )
			: parser.getDependency( 'skin', nodeDef.skin );

		return Promise.all( [
			nodePending,
			Promise.all( childPending ),
			skeletonPending
		] ).then( function ( results ) {

			const node = results[ 0 ];
			const children = results[ 1 ];
			const skeleton = results[ 2 ];

			if ( skeleton !== null ) {

				// This full traverse should be fine because
				// child glTF nodes have not been added to this node yet.
				node.traverse( function ( mesh ) {

					if ( ! mesh.isSkinnedMesh ) return;

					mesh.bind( skeleton, _identityMatrix );

				} );

			}

			for ( let i = 0, il = children.length; i < il; i ++ ) {

				node.add( children[ i ] );

			}

			return node;

		} );

	}

	// ._loadNodeShallow() parses a single node.
	// skin and child nodes are created and added in .loadNode() (no '_' prefix).
	_loadNodeShallow( nodeIndex ) {

		const json = this.json;
		const extensions = this.extensions;
		const parser = this;

		// This method is called from .loadNode() and .loadSkin().
		// Cache a node to avoid duplication.

		if ( this.nodeCache[ nodeIndex ] !== undefined ) {

			return this.nodeCache[ nodeIndex ];

		}

		const nodeDef = json.nodes[ nodeIndex ];

		// reserve node's name before its dependencies, so the root has the intended name.
		const nodeName = nodeDef.name ? parser.createUniqueName( nodeDef.name ) : '';

		const pending = [];

		const meshPromise = parser._invokeOne( function ( ext ) {

			return ext.createNodeMesh && ext.createNodeMesh( nodeIndex );

		} );

		if ( meshPromise ) {

			pending.push( meshPromise );

		}

		if ( nodeDef.camera !== undefined ) {

			pending.push( parser.getDependency( 'camera', nodeDef.camera ).then( function ( camera ) {

				return parser._getNodeRef( parser.cameraCache, nodeDef.camera, camera );

			} ) );

		}

		parser._invokeAll( function ( ext ) {

			return ext.createNodeAttachment && ext.createNodeAttachment( nodeIndex );

		} ).forEach( function ( promise ) {

			pending.push( promise );

		} );

		this.nodeCache[ nodeIndex ] = Promise.all( pending ).then( function ( objects ) {

			let node;

			// .isBone isn't in glTF spec. See ._markDefs
			if ( nodeDef.isBone === true ) {

				node = new Bone();

			} else if ( objects.length > 1 ) {

				node = new Group();

			} else if ( objects.length === 1 ) {

				node = objects[ 0 ];

			} else {

				node = new Object3D();

			}

			if ( node !== objects[ 0 ] ) {

				for ( let i = 0, il = objects.length; i < il; i ++ ) {

					node.add( objects[ i ] );

				}

			}

			if ( nodeDef.name ) {

				node.userData.name = nodeDef.name;
				node.name = nodeName;

			}

			assignExtrasToUserData( node, nodeDef );

			if ( nodeDef.extensions ) addUnknownExtensionsToUserData( extensions, node, nodeDef );

			if ( nodeDef.matrix !== undefined ) {

				const matrix = new Matrix4();
				matrix.fromArray( nodeDef.matrix );
				node.applyMatrix4( matrix );

			} else {

				if ( nodeDef.translation !== undefined ) {

					node.position.fromArray( nodeDef.translation );

				}

				if ( nodeDef.rotation !== undefined ) {

					node.quaternion.fromArray( nodeDef.rotation );

				}

				if ( nodeDef.scale !== undefined ) {

					node.scale.fromArray( nodeDef.scale );

				}

			}

			if ( ! parser.associations.has( node ) ) {

				parser.associations.set( node, {} );

			}

			parser.associations.get( node ).nodes = nodeIndex;

			return node;

		} );

		return this.nodeCache[ nodeIndex ];

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 * @param {number} sceneIndex
	 * @return {Promise<Group>}
	 */
	loadScene( sceneIndex ) {

		const extensions = this.extensions;
		const sceneDef = this.json.scenes[ sceneIndex ];
		const parser = this;

		// Loader returns Group, not Scene.
		// See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
		const scene = new Group();
		if ( sceneDef.name ) scene.name = parser.createUniqueName( sceneDef.name );

		assignExtrasToUserData( scene, sceneDef );

		if ( sceneDef.extensions ) addUnknownExtensionsToUserData( extensions, scene, sceneDef );

		const nodeIds = sceneDef.nodes || [];

		const pending = [];

		for ( let i = 0, il = nodeIds.length; i < il; i ++ ) {

			pending.push( parser.getDependency( 'node', nodeIds[ i ] ) );

		}

		return Promise.all( pending ).then( function ( nodes ) {

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				scene.add( nodes[ i ] );

			}

			// Removes dangling associations, associations that reference a node that
			// didn't make it into the scene.
			const reduceAssociations = ( node ) => {

				const reducedAssociations = new Map();

				for ( const [ key, value ] of parser.associations ) {

					if ( key instanceof Material || key instanceof Texture ) {

						reducedAssociations.set( key, value );

					}

				}

				node.traverse( ( node ) => {

					const mappings = parser.associations.get( node );

					if ( mappings != null ) {

						reducedAssociations.set( node, mappings );

					}

				} );

				return reducedAssociations;

			};

			parser.associations = reduceAssociations( scene );

			return scene;

		} );

	}

	_createAnimationTracks( node, inputAccessor, outputAccessor, sampler, target ) {

		const tracks = [];

		const targetName = node.name ? node.name : node.uuid;
		const targetNames = [];

		if ( PATH_PROPERTIES[ target.path ] === PATH_PROPERTIES.weights ) {

			node.traverse( function ( object ) {

				if ( object.morphTargetInfluences ) {

					targetNames.push( object.name ? object.name : object.uuid );

				}

			} );

		} else {

			targetNames.push( targetName );

		}

		let TypedKeyframeTrack;

		switch ( PATH_PROPERTIES[ target.path ] ) {

			case PATH_PROPERTIES.weights:

				TypedKeyframeTrack = NumberKeyframeTrack;
				break;

			case PATH_PROPERTIES.rotation:

				TypedKeyframeTrack = QuaternionKeyframeTrack;
				break;

			case PATH_PROPERTIES.position:
			case PATH_PROPERTIES.scale:

				TypedKeyframeTrack = VectorKeyframeTrack;
				break;

			default:

				switch ( outputAccessor.itemSize ) {

					case 1:
						TypedKeyframeTrack = NumberKeyframeTrack;
						break;
					case 2:
					case 3:
					default:
						TypedKeyframeTrack = VectorKeyframeTrack;
						break;

				}

				break;

		}

		const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[ sampler.interpolation ] : InterpolateLinear;


		const outputArray = this._getArrayFromAccessor( outputAccessor );

		for ( let j = 0, jl = targetNames.length; j < jl; j ++ ) {

			const track = new TypedKeyframeTrack(
				targetNames[ j ] + '.' + PATH_PROPERTIES[ target.path ],
				inputAccessor.array,
				outputArray,
				interpolation
			);

			// Override interpolation with custom factory method.
			if ( sampler.interpolation === 'CUBICSPLINE' ) {

				this._createCubicSplineTrackInterpolant( track );

			}

			tracks.push( track );

		}

		return tracks;

	}

	_getArrayFromAccessor( accessor ) {

		let outputArray = accessor.array;

		if ( accessor.normalized ) {

			const scale = getNormalizedComponentScale( outputArray.constructor );
			const scaled = new Float32Array( outputArray.length );

			for ( let j = 0, jl = outputArray.length; j < jl; j ++ ) {

				scaled[ j ] = outputArray[ j ] * scale;

			}

			outputArray = scaled;

		}

		return outputArray;

	}

	_createCubicSplineTrackInterpolant( track ) {

		track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline( result ) {

			// A CUBICSPLINE keyframe in glTF has three output values for each input value,
			// representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
			// must be divided by three to get the interpolant's sampleSize argument.

			const interpolantType = ( this instanceof QuaternionKeyframeTrack ) ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;

			return new interpolantType( this.times, this.values, this.getValueSize() / 3, result );

		};

		// Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
		track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

	}

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 */
function computeBounds( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const box = new Box3();

	if ( attributes.POSITION !== undefined ) {

		const accessor = parser.json.accessors[ attributes.POSITION ];

		const min = accessor.min;
		const max = accessor.max;

		// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

		if ( min !== undefined && max !== undefined ) {

			box.set(
				new Vector3( min[ 0 ], min[ 1 ], min[ 2 ] ),
				new Vector3( max[ 0 ], max[ 1 ], max[ 2 ] )
			);

			if ( accessor.normalized ) {

				const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
				box.min.multiplyScalar( boxScale );
				box.max.multiplyScalar( boxScale );

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

			return;

		}

	} else {

		return;

	}

	const targets = primitiveDef.targets;

	if ( targets !== undefined ) {

		const maxDisplacement = new Vector3();
		const vector = new Vector3();

		for ( let i = 0, il = targets.length; i < il; i ++ ) {

			const target = targets[ i ];

			if ( target.POSITION !== undefined ) {

				const accessor = parser.json.accessors[ target.POSITION ];
				const min = accessor.min;
				const max = accessor.max;

				// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

				if ( min !== undefined && max !== undefined ) {

					// we need to get max of absolute components because target weight is [-1,1]
					vector.setX( Math.max( Math.abs( min[ 0 ] ), Math.abs( max[ 0 ] ) ) );
					vector.setY( Math.max( Math.abs( min[ 1 ] ), Math.abs( max[ 1 ] ) ) );
					vector.setZ( Math.max( Math.abs( min[ 2 ] ), Math.abs( max[ 2 ] ) ) );


					if ( accessor.normalized ) {

						const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
						vector.multiplyScalar( boxScale );

					}

					// Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
					// to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
					// are used to implement key-frame animations and as such only two are active at a time - this results in very large
					// boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
					maxDisplacement.max( vector );

				} else {

					console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

				}

			}

		}

		// As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
		box.expandByVector( maxDisplacement );

	}

	geometry.boundingBox = box;

	const sphere = new Sphere();

	box.getCenter( sphere.center );
	sphere.radius = box.min.distanceTo( box.max ) / 2;

	geometry.boundingSphere = sphere;

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addPrimitiveAttributes( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const pending = [];

	function assignAttributeAccessor( accessorIndex, attributeName ) {

		return parser.getDependency( 'accessor', accessorIndex )
			.then( function ( accessor ) {

				geometry.setAttribute( attributeName, accessor );

			} );

	}

	for ( const gltfAttributeName in attributes ) {

		const threeAttributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

		// Skip attributes already provided by e.g. Draco extension.
		if ( threeAttributeName in geometry.attributes ) continue;

		pending.push( assignAttributeAccessor( attributes[ gltfAttributeName ], threeAttributeName ) );

	}

	if ( primitiveDef.indices !== undefined && ! geometry.index ) {

		const accessor = parser.getDependency( 'accessor', primitiveDef.indices ).then( function ( accessor ) {

			geometry.setIndex( accessor );

		} );

		pending.push( accessor );

	}

	if ( ColorManagement.workingColorSpace !== LinearSRGBColorSpace && 'COLOR_0' in attributes ) {

		console.warn( `THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ColorManagement.workingColorSpace}" not supported.` );

	}

	assignExtrasToUserData( geometry, primitiveDef );

	computeBounds( geometry, primitiveDef, parser );

	return Promise.all( pending ).then( function () {

		return primitiveDef.targets !== undefined
			? addMorphTargets( geometry, primitiveDef.targets, parser )
			: geometry;

	} );

}


 return GLTFLoader;
})(THREE);
function disposeObject(group){
 const owned=new Set(),images=new Set();
 group.traverse(o=>{if(o.geometry)owned.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){owned.add(m);for(const v of Object.values(m))if(v?.isTexture){owned.add(v);if(v.image?.close)images.add(v.image);}}});
 for(const r of owned)r.dispose();for(const image of images)image.close();group.clear();
}
async function loadObject(assetId,options={}){
 const item=GLB_OBJECTS.find(m=>m.assetId===assetId||m.id===assetId);
 if(!item)throw Error('Choose one of the 36 bundled genuine GLB objects.');
 const response=await fetch(assetUrl(item.assetPath,options));if(!response.ok)throw Error('The bundled model could not be opened: '+item.title);
 const gltf=await new GLTFLoader().parseAsync(await response.arrayBuffer(),'');
 const root=gltf.scene;root.traverse(o=>{if(o.isLight||o.isCamera)o.visible=false;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3());
 const dimension=Math.max(size.x,size.y,size.z);if(!Number.isFinite(dimension)||dimension<=0){disposeObject(root);throw Error('The model has no finite visible geometry.');}
 const group=new THREE.Group();group.name=item.title;group.add(root);
 if(options.normalize!==false){root.position.sub(new THREE.Vector3((bounds.min.x+bounds.max.x)/2,bounds.min.y,(bounds.min.z+bounds.max.z)/2));group.scale.setScalar(1/dimension);}
 group.updateMatrixWorld(true);group.size=new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
 group.userData={storeObjectId:item.id,assetId:item.assetId,label:item.title,source:item,animations:gltf.animations};
 let disposed=false;group.dispose=()=>{if(!disposed){disposed=true;disposeObject(group);}};
 return group;
}
// Exact public learning-object constructions extracted from residence-scene-v1.
function learningObjectPreview(item){
 const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const box=(group,w,h,d,x,y,z,material,data)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;if(data)o.userData=data;group.add(o);return o;};
 const sphere=(group,r,x,y,z,material)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),material);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o;};
 const cylinder=(group,r,h,x,y,z,material)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;group.add(o);return o;};
 function chair(group,x,z,color){const wood=mat('#99704c'),fabric=mat(color);box(group,.55,.13,.55,x,.48,z,fabric);box(group,.55,.6,.1,x,.81,z+.25,fabric);for(const dx of [-.2,.2])for(const dz of [-.2,.2])box(group,.055,.45,.055,x+dx,.225,z+dz,wood);}
 const group=new THREE.Group();
 if(item.type==='furnishing'){
  const feature={type:item.id},installed=group,r=SOCRATES_STARTER.rooms[0],x=0,z=0,wood=mat('#93714e'),linen=mat('#e4d7be'),accent=mat(r.color);
    if(feature.type==='reflection_lamp'){cylinder(installed,.23,.05,x,.03,z,wood);cylinder(installed,.035,1.65,x,.87,z,wood);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.38,.32,20),linen);shade.position.set(x,1.7,z);installed.add(shade);sphere(installed,.1,x,1.6,z,new THREE.MeshStandardMaterial({color:'#f1d69e',emissive:'#eab466',emissiveIntensity:1}));const glow=new THREE.PointLight('#ffd49a',3,3,2);glow.position.set(x,1.45,z);installed.add(glow);}
  if(feature.type==='question_board'){box(installed,1.15,1.03,.11,x,1.38,z,wood);box(installed,1.02,.9,.13,x,1.38,z-.015,linen);for(const dx of [-.44,.44])box(installed,.07,.9,.07,x+dx,.45,z,wood);for(let n=0;n<3;n++)box(installed,.2,.16,.02,x-.3+n*.3,1.36,z-.09,accent);}
  if(feature.type==='experiment_table'){box(installed,1.25,.1,.75,x,.73,z,wood);for(const dx of [-.47,.47])for(const dz of [-.23,.23])box(installed,.06,.68,.06,x+dx,.34,z+dz,wood);sphere(installed,.15,x-.3,.94,z,accent);cylinder(installed,.12,.32,x+.25,.94,z,linen);}
  if(feature.type==='discussion_circle'){chair(installed,x-.4,z, r.color);chair(installed,x+.38,z-.65,'#b69b77');cylinder(installed,.36,.44,x-.25,.22,z-.5,wood);}

 }else if(item.type==='idea'){
  const idea={cue:item.cue},r=SOCRATES_STARTER.rooms[0],x=0,y=0,z=0,scale=1,data={storeObjectId:item.id},interior=group,objects=[];
     let geometry,rotation=null;if(idea.cue==='crystal')geometry=new THREE.OctahedronGeometry(.43);if(idea.cue==='sphere')geometry=new THREE.SphereGeometry(.34,24,16);if(idea.cue==='ring')geometry=new THREE.TorusGeometry(.32,.095,14,40);if(idea.cue==='book'){geometry=new THREE.BoxGeometry(.54,.13,.4);rotation=[.1,0,.13];}
   const object=new THREE.Mesh(geometry,idea.cue==='book'?mat('#e4dbc5'):mat(r.color,.28,.2));object.position.set(x,y,z);object.scale.setScalar(scale);if(rotation)object.rotation.set(...rotation);object.castShadow=true;object.userData=data;interior.add(object);objects.push(object);
   if(idea.cue==='book'){for(const direction of [-1,1])box(object,.575,.017,.43,0,direction*.078,0,mat(r.color));box(object,.028,.17,.43,-.276,0,0,mat(r.color));for(let n=0;n<4;n++)box(object,.49,.003,.007,.015,-.035+n*.023,.203,mat('#bdb397'));for(let n=0;n<3;n++)box(object,.27-n*.03,.003,.012,.04,.09,-.075+n*.055,mat('#cab886'));}
   if(idea.cue==='sphere'){for(const tilt of [0,Math.PI/2]){const band=new THREE.Mesh(new THREE.TorusGeometry(.343,.01,6,36),mat('#b6a47c',.35,.5));band.rotation.x=tilt;object.add(band);}}

 }else throw Error('No public construction exists for this object.');
 group.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(group),size=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
 group.position.sub(c);return {group,size,dispose(){disposeObject(group);}};
}
async function storePreview(item,options={}){
 if(item.type==='model'){const group=await loadObject(item.assetId,options);group.position.y=-group.size.y/2;return {group,size:group.size,dispose:group.dispose};}
 if(item.type==='painting'){
  const texture=await new THREE.TextureLoader().loadAsync(assetUrl(item.imageUrl,options));texture.colorSpace=THREE.SRGBColorSpace;
  const group=new THREE.Group(),geometry=new THREE.BoxGeometry(1.65,1.2,.08),frame=new THREE.MeshStandardMaterial({color:'#6e5130'}),plane=new THREE.PlaneGeometry(1.5,1.05),material=new THREE.MeshBasicMaterial({map:texture});
  group.add(new THREE.Mesh(geometry,frame));const face=new THREE.Mesh(plane,material);face.position.z=.045;group.add(face);
  return {group,size:new THREE.Vector3(1.65,1.2,.08),dispose(){disposeObject(group);}};
 }
 return learningObjectPreview(item);
}
// Fixed, public displays; visiting or inspecting never changes a saved house.
const normalObjects=STORE_OBJECTS.filter(item=>!item.hasOriginalAudio),musicObjects=STORE_OBJECTS.filter(item=>item.hasOriginalAudio);
const MARKET_STALLS = Object.freeze(STORE_OBJECTS.map(item=>{
 const index=(item.hasOriginalAudio?musicObjects:normalObjects).indexOf(item),x=item.hasOriginalAudio?-39+(index%2)*5.4:(index%8-3.5)*5.4,z=item.hasOriginalAudio?21-Math.floor(index/2)*6:24-Math.floor(index/8)*6;
 return Object.freeze({id:item.id,title:item.title,category:item.category,x,z,approach:{x,z:z+2,yaw:0}});
}));

function buildObjectMarketOriginal(THREE,{loadPreview=storePreview,previewLimit=6}={}){
 const group=new THREE.Group(),colliders=[],materials=new Map(),geometries=new Map(),textures=[],displays=new Map();
 const bounds={minX:-48,maxX:27,minZ:-48,maxZ:39},spawn={x:0,z:34.5,yaw:0},guideAnchor={x:5.5,z:32};
 let disposed=false,active=false,queue=[],loading=0;
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.85}));return materials.get(color);};
 const box=(w,h,d,x,y,z,color,data)=>{const key=[w,h,d].join(':');if(!geometries.has(key))geometries.set(key,new THREE.BoxGeometry(w,h,d));const mesh=new THREE.Mesh(geometries.get(key),material(color));mesh.position.set(x,y,z);if(data)mesh.userData=data;group.add(mesh);return mesh;};
 function sign(text,x,y,z,width,data){box(width,.4,.1,x,y,z,'#eadfc5',data);if(typeof document==='undefined')return;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=64;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.fillStyle='#eadfc5';ctx.fillRect(0,0,512,64);ctx.fillStyle='#243d36';ctx.font='600 26px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,32,490);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);const plane=new THREE.PlaneGeometry(width-.03,.38),mat=new THREE.MeshBasicMaterial({map:texture});const face=new THREE.Mesh(plane,mat);face.position.set(x,y,z+.056);if(data)face.userData=data;group.add(face);}
 box(75,.12,87,-10.5,-.08,-4.5,'#9cae86');box(45,.035,78,0,.005,-7,'#d6c6a5');
 for(let row=0;row<Math.ceil(normalObjects.length/8);row++)box(45,.015,2.4,0,.03,26-row*6,'#eadfc5');
 box(2.2,.025,78,0,.045,-1.5,'#e7d7b6');box(20,.035,36,-36,.005,10,'#d6c6a5');box(69,.035,2.4,-10,.04,30,'#eadfc5');sign('LISTENING GARDEN · 10 original songs',-36,3.1,26,9);for(const x of [-40.6,-31.4])box(.18,3.2,.18,x,1.6,26,'#665844');
 sign('OBJECT MARKET · Open-air collection',0,3.6,29,8);
 sign('Walk the aisles · E to inspect · M for the map',0,2.85,29,8);
 const catalogue={cityAction:'store-catalogue',label:'Browse market catalogue & sources'};
 sign('CATALOGUE & SOURCES · E',-6.4,1.5,30,3.5,catalogue);
 box(.16,1.5,.16,-6.4,.75,30,'#665844');
 colliders.push({minX:-6.6,maxX:-6.2,minZ:29.8,maxZ:30.2,label:'Catalogue stand'});
 for(const x of [-4.3,4.3])box(.22,3.8,.22,x,1.9,29,'#665844');
 sign('Furniture & curiosities',-12,3.1,25.7,7);
 sign('Paintings beyond · follow the avenue',12,3.1,25.7,8);
 for(const stall of MARKET_STALLS){
  const item=STORE_OBJECTS.find(i=>i.id===stall.id),data={cityAction:'store-object',storeObjectId:item.id,label:(item.hasOriginalAudio?'Play ':'Inspect ')+item.title};
  const display=new THREE.Group();display.position.set(stall.x,0,stall.z);display.userData=data;group.add(display);
  const width=item.type==='painting'?2.4:2.7,depth=item.type==='painting'?.6:2.3;
  box(width,.2,depth,stall.x,.1,stall.z,'#a48762',data);
  colliders.push({minX:stall.x-width/2,maxX:stall.x+width/2,minZ:stall.z-depth/2,maxZ:stall.z+depth/2,label:item.title});
  sign(item.title,stall.x,.55,stall.z+depth/2+.02,3.5,data);
  sign(item.category,stall.x,2.8,stall.z-.8,3.6,data);
  for(const side of [-1,1])box(.09,2.85,.09,stall.x+side*1.55,1.425,stall.z-.8,'#665844',data);
  // A physical source plaque remains usable even while the exhibit loads.
  const plaque=box(.55,.65,.08,stall.x+1.8,.95,stall.z+.7,'#5c7d73',data);
  colliders.push({minX:plaque.position.x-.28,maxX:plaque.position.x+.28,minZ:plaque.position.z-.1,maxZ:plaque.position.z+.1,label:'Source plaque'});
  displays.set(item.id,{item,stall,display,model:null,pending:false,wanted:false,error:false});
 }
 const travel={cityAction:'city-avenue',label:'Continue walking along the city avenue'};
 sign('CITY AVENUE',0,2.1,37,6,travel);box(6,.12,.2,0,.06,37,'#617b71',travel);
 for(const x of [-25,25])for(const z of [-30,-18,-6,6,18,30]){box(.6,.65,.6,x,.33,z,'#8c7658');box(1.3,1.8,1.3,x,1.45,z,'#58765b');colliders.push({minX:x-.7,maxX:x+.7,minZ:z-.7,maxZ:z+.7,label:'Garden tree'});}
 const canStand=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&x>bounds.minX+.22&&x<bounds.maxX-.22&&z>bounds.minZ+.22&&z<bounds.maxZ-.22&&!colliders.some(c=>x>c.minX-.22&&x<c.maxX+.22&&z>c.minZ-.22&&z<c.maxZ+.22);
 function release(entry){if(!entry.model)return;entry.display.remove(entry.model.group);entry.model.dispose();entry.model.release?.();entry.model=null;}
 function pump(){while(!disposed&&active&&loading<2&&queue.length){const entry=queue.shift();if(entry.pending||entry.model||!entry.wanted||entry.error)continue;entry.pending=true;loading++;Promise.resolve().then(()=>loadPreview(entry.item)).then(model=>{
   if(disposed||!active||!entry.wanted){model.dispose();model.release?.();return;}
   const holder=new THREE.Group(),size=model.size||new THREE.Box3().setFromObject(model.group).getSize(new THREE.Vector3()),factor=entry.item.type==='painting'?1.35:(entry.item.type==='model'?entry.item.scale:entry.item.type==='idea'?.6:2.2)/Math.max(size.x,size.y,size.z);
   holder.add(model.group);holder.scale.setScalar(factor);holder.updateMatrixWorld(true);const bottom=new THREE.Box3().setFromObject(holder).min.y;holder.position.y=.22-bottom;holder.userData={cityAction:'store-object',storeObjectId:entry.item.id,label:(entry.item.hasOriginalAudio?'Play ':'Inspect ')+entry.item.title};entry.display.add(holder);entry.model={...model,group:holder};
  }).catch(()=>{entry.error=true;}).finally(()=>{entry.pending=false;loading--;pump();});}}
 function update(point){if(disposed||!point||!Number.isFinite(point.x)||!Number.isFinite(point.z))return;active=true;const nearby=[...displays.values()].map(entry=>({entry,d:Math.hypot(point.x-entry.stall.x,point.z-entry.stall.z)})).filter(v=>v.d<15).sort((a,b)=>a.d-b.d).slice(0,Math.max(1,Math.min(10,Math.floor(previewLimit)||6)));const ids=new Set(nearby.map(v=>v.entry.item.id));for(const entry of displays.values()){entry.wanted=ids.has(entry.item.id);if(!entry.wanted)release(entry);}queue=nearby.map(v=>v.entry);pump();}
 function suspend(){active=false;queue=[];for(const entry of displays.values()){entry.wanted=false;entry.error=false;release(entry);}}
 return {group,bounds,spawn,guideAnchor,colliders,stalls:MARKET_STALLS,canStand,insideAt:()=> 'Open-air Object Market',update,suspend,
  entryFor(id){return MARKET_STALLS.find(s=>s.id===id)?.approach||null;},
  previewStatus(){return [...displays.values()].map(e=>({id:e.item.id,ready:!!e.model,pending:e.pending,error:e.error,wanted:e.wanted}));},
  dispose(){if(disposed)return;disposed=true;suspend();const owned=new Set([...textures,...materials.values(),...geometries.values()]);group.traverse(o=>{if(o.geometry)owned.add(o.geometry);for(const mat of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])owned.add(mat);});for(const resource of owned)resource.dispose();group.clear();}
 };
}

function buildObjectMarket(T=THREE,options={}){assertThree(T);return buildObjectMarketOriginal(T,{...options,loadPreview:options.loadPreview||((item)=>storePreview(item,options))});}
g.CITY_SOURCES={ARTISTS,SOCRATES_STARTER,OBJECTS:STORE_OBJECTS,STORE_OBJECTS,GLB_OBJECTS,MARKET_STALLS,BOOKS,HOME_ROLES,HOME_BOOKS,buildArtCity,buildObjectMarket,buildInterior,furnishRoom,toggleHomeLight,sharedEdge,entranceFor,houseBounds,ideaDisplays,assetUrl,loadObject,loadPreview:storePreview,GLTFLoader,createSocratesStarter:()=>JSON.parse(JSON.stringify(SOCRATES_STARTER)),provenance:{houseCommit:'48ccb361e8e64857f4e9f94f4598d8dc97970e00',artistCommit:'7161f1c420328386046ef6413c04a51868be38de',atlasCommit:'84f9f1d141e1a4dda4caa04d26476e958af42c19',privateSavedStateAvailable:false}};
})(window);
