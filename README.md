# Portfolio — Irving Dávila

Portfolio personal: automatización con IA y desarrollo full-stack.
Incluye una demo en vivo de **DataRefine** (`/demo/datarefine`).

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # sirve el build localmente
npm run lint     # ESLint
```

Variables en `.env`:

- `VITE_API_URL`: URL del backend de DataRefine (la demo).
- `VITE_SITE_URL`: URL pública del sitio, sin `/` final. Se usa para la URL
  canónica y la imagen al compartir en redes (`public/og-image.jpg`).

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Textos, menú, servicios, proyectos, calculadora, proceso, bio, FAQ, contacto | `src/content.js` |
| Correo, GitHub y LinkedIn | `PROFILE` en `src/content.js` |
| Paleta, fuentes y animaciones globales | `src/styles/GlobalStyles.jsx`, `index.html` |
| Secciones de la página principal | `src/pages/Landing.jsx` |
| Fotos | `public/irving-card.jpg` (credencial), `public/irving-about.jpg` (Sobre mí) |
| Imágenes de proyectos | `public/project-villanet.jpg`, `public/villanet-alta.jpg`, `public/villanet-pago.jpg`; captura de la vitrina: `public/demo-datarefine.jpg` |
| Reverso de la credencial 3D (incluye el PIN `1024`) | `public/card-back.svg` |
| PIN del modo desarrollador y datos del panel | `DEV_MODE` en `src/content.js` |
| Videos (Loom o YouTube) de cada demo | campos `video` en `PROJECT` y `PROJECTS`; `SHOWCASE.video` acepta un .mp4 en `public/` |

## Componentes de React Bits

Adaptados a la paleta del sitio y con soporte para `prefers-reduced-motion`,
en `src/components/reactbits/`. Los de la categoría Micro, Folder y Crosshair
conservan el código original (con framer-motion e íconos SVG propios):

| Componente | Dónde se usa |
| --- | --- |
| Lanyard | Credencial 3D del hero (`src/components/Lanyard.jsx`) |
| BlurText | Titular del hero y título de la demo |
| RotatingText | Especialidades rotando en el hero |
| ShinyText | Insignia "Disponible" y "Demo en vivo" |
| GradientText | Palabras destacadas en latón |
| DecryptedText | Etiquetas numeradas de cada sección |
| ScrollVelocity | Franjas de texto bajo el hero |
| SpotlightCard | Ficha del explorador de herramientas y tarjetas de la demo |
| MagicBento | Servicios en rejilla bento con mini visuales |
| ScrollExpand | Apertura del caso de estudio: la demo crece a pantalla completa |
| PixelTransition | Comparación antes/después en portadas de proyectos (campo `compare`) |
| CountUp | Cifras del caso de estudio |
| AnimatedContent | Aparición de bloques al hacer scroll |
| Magnet | Botones principales |
| TiltedCard | Foto de "Sobre mí" |
| StaggeredMenu | Menú móvil |
| Squares | Fondo de la sección de contacto y de la demo |
| VariableProximity | Nombre grande que abre "Sobre mí" |
| ClickSpark | Chispas al hacer clic (global) |
| FuzzyText | Página 404 |
| Folder | Fichas técnicas de DataRefine ("Bajo el capó") |
| BranchedMenu | Explorador de herramientas en "Sobre mí" |
| StatusMark | Línea de tiempo del Proceso y pasos de la demo |
| ThoughtLine | IA "pensando" en la demo animada, en DataLab y en el modo desarrollador |
| CodeSlots | Modo desarrollador del pie (PIN del reverso de la credencial) |
| Crosshair | Mira con coordenadas en la sección de contacto (sólo con mouse) |
| Stepper | Brief de proyecto en 3 pasos (Contacto) |
| SwipeToast | Avisos al copiar el correo o el mensaje |
| WarmTooltip | Tooltips de los íconos sociales |
| LogoLoop | Cinta con los logos del stack (Simple Icons, CC0) |
| ScrollReveal | Manifiesto que se enciende al hacer scroll (versión sin GSAP) |
| LatticeLoader | Carga de las páginas secundarias |
| ScrollStack | "Más proyectos": tarjetas que se apilan al hacer scroll (lista normal en móvil) |
| GlareHover | Destello sobre las portadas de los proyectos |
| ElasticSlider | Controles de la calculadora de costo del trabajo manual |
| Counter | Cifras animadas de la calculadora |
| StarBorder | Botón secundario del hero |
| Stack | Diagramas arrastrables de VillaNet |
| ElectricBorder | Zona de carga y tabla en proceso de la demo (sólo con WebGL acelerado) |
| AnimatedList | Problemas detectados en la demo (filtra la vista previa) |

## Rendimiento

- Las fuentes se alojan en el propio sitio (Fontsource), sin CSS bloqueante de Google.
- Los widgets de más abajo (carpeta, explorador, brief, modo dev, mira, logos)
  se descargan cuando están por verse (`src/components/Deferred.jsx`), y las
  secciones fuera de pantalla usan `content-visibility: auto`.
- La credencial 3D se monta cuando el navegador queda libre y compila sus
  shaders en paralelo. Sin aceleración gráfica (WebGL por software) se muestra
  una versión ligera en CSS (`src/components/StaticBadge.jsx`).
