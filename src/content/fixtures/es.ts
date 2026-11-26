import type { Block, Page, Post, SiteSettings } from '../types'
import { createPortableText } from './pt'
import { no, row, yes } from './table'

type PageInput = Omit<Page, '_id' | '_type' | 'language' | 'translations'>
type PostInput = Omit<Post, '_id' | '_type' | 'language' | 'translations' | 'readingMinutes'>

const apogee = { key: 'apogee', label: 'Apogee' }
const meridian = { key: 'meridian', label: 'Meridian' }
const perigee = { key: 'perigee', label: 'Perigee' }

const budget = [1000, 2000, 4000, 8000, 16000, 32000, 64000]
const promptLength = [500, 2000, 8000, 32000, 128000]

function series(id: string, model: { key: string; label: string }, xs: number[], ys: number[]) {
  return {
    _key: `${id}-${model.key}`,
    key: model.key,
    label: model.label,
    points: xs.map((x, i) => ({ _key: `${id}-${model.key}-${i}`, x, y: ys[i] ?? 0 })),
  }
}

export const settings: Omit<SiteSettings, '_id' | '_type' | 'language'> = {
  siteName: 'Orrery Labs',
  tagline: 'IA que muestra su trabajo.',
  description:
    'Orrery Labs crea modelos de lenguaje que muestran su razonamiento como trazas verificables, para que los equipos comprueben una respuesta antes de usarla.',
  navigation: [
    { _key: 'nav-models', label: 'Modelos', href: '/modelos' },
    { _key: 'nav-research', label: 'Investigación', href: '/blog' },
    { _key: 'nav-about', label: 'Nosotros', href: '/nosotros' },
  ],
  footerColumns: [
    {
      _key: 'col-product',
      title: 'Producto',
      links: [
        { _key: 'f-models', label: 'Modelos', href: '/modelos' },
        { _key: 'f-research', label: 'Investigación', href: '/blog' },
      ],
    },
    {
      _key: 'col-company',
      title: 'Empresa',
      links: [
        { _key: 'f-about', label: 'Nosotros', href: '/nosotros' },
        { _key: 'f-launch', label: 'Presentamos Apogee', href: '/blog/presentamos-apogee' },
      ],
    },
  ],
}

const homeBlocks: Block[] = [
  {
    _key: 'home-hero',
    _type: 'hero',
    eyebrow: 'Orrery Labs',
    heading: 'IA que muestra su trabajo.',
    subheading:
      'Los modelos de Orrery muestran su razonamiento como trazas verificables, para que tu equipo compruebe una respuesta antes de que llegue a un cliente.',
    primaryCta: { label: 'Conoce los modelos', href: '/modelos' },
    secondaryCta: { label: 'Lee la investigación', href: '/blog' },
    patternSeed: 'home',
  },
  {
    _key: 'home-features',
    _type: 'featureGrid',
    heading: 'Hechos para comprobarse, no solo para confiar',
    intro:
      'Cada modelo de Orrery parte de una idea: una respuesta solo es útil si puedes verificarla.',
    features: [
      {
        _key: 'f1',
        icon: 'orbit',
        title: 'Razonamiento verificable',
        body: 'Cada respuesta incluye una traza estructurada de los pasos que la sustentan. Quien revisa sigue la lógica en lugar de adivinarla.',
      },
      {
        _key: 'f2',
        icon: 'gauge',
        title: 'Confianza calibrada',
        body: 'Cuando un modelo de Orrery dice que está seguro al 80 %, acierta alrededor del 80 % de las veces. El resto puede revisarlo una persona.',
      },
      {
        _key: 'f3',
        icon: 'shield',
        title: 'Privado por defecto',
        body: 'Funciona en tu propia cuenta en la nube. Las peticiones y respuestas nunca salen de ella y nunca entrenamos con tus datos.',
      },
      {
        _key: 'f4',
        icon: 'layers',
        title: 'Contexto largo y ordenado',
        body: 'Hasta un millón de tokens de contexto, con citas que señalan el pasaje exacto en el que se basa cada respuesta.',
      },
    ],
  },
  {
    _key: 'home-chart',
    _type: 'chartBlock',
    heading: 'Más razonamiento, mejores respuestas, hasta cierto punto',
    intro:
      'Precisión en una prueba de razonamiento de varios pasos a medida que cada modelo recibe más presupuesto de razonamiento. Pasa el cursor o usa las flechas para comparar.',
    chart: {
      xLabel: 'Presupuesto de razonamiento (tokens)',
      yLabel: 'Precisión',
      xScale: 'log',
      xFormat: 'tokens',
      yFormat: 'percent',
      series: [
        series('budget', apogee, budget, [0.62, 0.69, 0.75, 0.8, 0.84, 0.865, 0.875]),
        series('budget', meridian, budget, [0.55, 0.61, 0.67, 0.71, 0.735, 0.75, 0.755]),
        series('budget', perigee, budget, [0.44, 0.49, 0.53, 0.555, 0.565, 0.57, 0.572]),
      ],
    },
    takeaway:
      'Apogee sigue mejorando a medida que crece el presupuesto. Perigee se estabiliza pronto, por eso es la mejor opción para tareas rápidas y sencillas.',
    note: 'Datos ilustrativos de un producto ficticio.',
  },
  {
    _key: 'home-stats',
    _type: 'stats',
    heading: 'Orrery en cifras',
    items: [
      {
        _key: 's1',
        value: '3',
        label: 'tamaños de modelo',
        detail: 'De Perigee para respuestas inmediatas a Apogee para análisis profundos.',
      },
      {
        _key: 's2',
        value: '1M',
        label: 'tokens de contexto',
        detail: 'Con citas hasta el nivel del pasaje.',
      },
      {
        _key: 's3',
        value: '<3 %',
        label: 'de error de calibración',
        detail: 'Error de calibración esperado en evaluaciones reservadas.',
      },
    ],
  },
  {
    _key: 'home-cta',
    _type: 'cta',
    heading: 'Compara los modelos',
    body: 'Elige el modelo adecuado para cada tarea, desde respuestas inmediatas hasta análisis cuidadosos de varios pasos.',
    link: { label: 'Comparar modelos', href: '/modelos' },
  },
]

const about = createPortableText('nosotros')

export const pages: PageInput[] = [
  {
    title: 'Inicio',
    slug: 'home',
    seo: {
      title: 'Orrery Labs: IA que muestra su trabajo',
      description:
        'Modelos de lenguaje que muestran su razonamiento como trazas verificables, para comprobar una respuesta antes de usarla.',
    },
    blocks: homeBlocks,
  },
  {
    title: 'Modelos',
    slug: 'modelos',
    seo: {
      title: 'Modelos',
      description:
        'Perigee, Meridian y Apogee: tres modelos de Orrery con las mismas trazas verificables. Elige por velocidad y profundidad.',
    },
    blocks: [
      {
        _key: 'models-hero',
        _type: 'hero',
        eyebrow: 'La familia Orrery',
        heading: 'Tres modelos, una misma forma de pensar',
        subheading:
          'Todos los modelos de Orrery generan las mismas trazas verificables. Elige por velocidad y profundidad, no por cuánto confías en ellos.',
        primaryCta: { label: 'Lee el anuncio', href: '/blog/presentamos-apogee' },
        patternSeed: 'models',
      },
      {
        _key: 'models-grid',
        _type: 'featureGrid',
        heading: 'Elige según la tarea',
        intro:
          'La misma API, las mismas trazas, los mismos controles de seguridad. Lo único que cambia es la profundidad.',
        features: [
          {
            _key: 'm1',
            icon: 'spark',
            title: 'Perigee',
            body: 'Nuestro modelo más rápido. Clasificación, extracción y respuestas cortas en unos cientos de milisegundos.',
          },
          {
            _key: 'm2',
            icon: 'compass',
            title: 'Meridian',
            body: 'La opción equilibrada. Buen razonamiento por una fracción del coste de Apogee.',
          },
          {
            _key: 'm3',
            icon: 'orbit',
            title: 'Apogee',
            body: 'Nuestro modelo más capaz, para investigación, análisis y trabajos largos de varios pasos.',
          },
        ],
      },
      {
        _key: 'models-compare',
        _type: 'comparison',
        heading: 'Compara los modelos',
        intro:
          'Las mismas trazas y controles de seguridad en todos los modelos. Elige por profundidad, velocidad y precio.',
        columns: [
          { _key: 'col-perigee', key: 'perigee', label: 'Perigee', tagline: 'El más rápido' },
          {
            _key: 'col-meridian',
            key: 'meridian',
            label: 'Meridian',
            tagline: 'Aquí empieza la mayoría',
            highlighted: true,
          },
          { _key: 'col-apogee', key: 'apogee', label: 'Apogee', tagline: 'El más capaz' },
        ],
        rows: [
          row('depth', 'Profundidad de razonamiento', 'Rendimiento', [1, 2, 3]),
          row(
            'latency',
            'Latencia mediana',
            'Rendimiento',
            ['240 ms', '560 ms', '1,3 s'],
            'Para una petición de 2K tokens',
          ),
          row('context', 'Ventana de contexto', 'Rendimiento', [
            '128K tokens',
            '500K tokens',
            '1M tokens',
          ]),
          row('traces', 'Trazas verificables', 'Funciones', [yes, yes, yes]),
          row('confidence', 'Confianza calibrada', 'Funciones', [yes, yes, yes]),
          row('citations', 'Citas por pasaje', 'Funciones', [no, yes, yes]),
          row('cloud', 'Funciona en tu propia nube', 'Funciones', [yes, yes, yes]),
          row(
            'price',
            'Precio de entrada',
            'Precio',
            ['0,40 US$', '2 US$', '12 US$'],
            'Por millón de tokens',
          ),
          row('best', 'Ideal para', 'Precio', [
            'Clasificación, extracción y respuestas cortas',
            'La mayoría de las funciones de producto',
            'Investigación y análisis largos',
          ]),
        ],
        footnote: 'Datos ilustrativos de un producto ficticio.',
      },
      {
        _key: 'models-chart',
        _type: 'chartBlock',
        heading: 'La latencia crece con el trabajo que pides',
        intro:
          'Tiempo mediano hasta una respuesta completa según crece la petición. Menos es mejor.',
        chart: {
          xLabel: 'Longitud de la petición (tokens)',
          yLabel: 'Latencia mediana',
          xScale: 'log',
          xFormat: 'tokens',
          yFormat: 'ms',
          series: [
            series('latency', perigee, promptLength, [180, 240, 390, 820, 2100]),
            series('latency', meridian, promptLength, [420, 560, 900, 1800, 4200]),
            series('latency', apogee, promptLength, [950, 1300, 2100, 4100, 9300]),
          ],
        },
        takeaway:
          'Perigee se mantiene por debajo de un segundo en la mayoría de las peticiones. Apogee merece la espera cuando la respuesta exige un análisis real.',
        note: 'Datos ilustrativos de un producto ficticio.',
      },
      {
        _key: 'models-cta',
        _type: 'cta',
        heading: '¿No sabes por dónde empezar?',
        body: 'La mayoría de los equipos empieza con Meridian y luego sube o baja tareas concretas tras leer las trazas.',
        link: {
          label: 'Por qué importa la calibración',
          href: '/blog/calibracion-antes-que-precision',
        },
      },
    ],
  },
  {
    title: 'Nosotros',
    slug: 'nosotros',
    seo: {
      title: 'Nosotros',
      description:
        'Orrery Labs es una pequeña empresa de investigación que crea modelos que muestran sus pruebas en lugar de pedir confianza.',
    },
    blocks: [
      {
        _key: 'about-hero',
        _type: 'hero',
        eyebrow: 'Nosotros',
        heading: 'Creamos modelos con los que se puede discutir',
        subheading:
          'Orrery Labs es una pequeña empresa de investigación. Creemos que el siguiente paso de la IA no es más confianza, sino mejores pruebas.',
        patternSeed: 'about',
      },
      {
        _key: 'about-text',
        _type: 'richText',
        content: [
          about.p(
            'Un planetario mecánico, en inglés *orrery*, es un modelo del sistema solar. Giras la manivela y ves moverse cada planeta, porque nada queda escondido en una caja negra. Pusimos ese nombre a la empresa porque ese es el tipo de modelo que queremos crear.',
          ),
          about.h2('En qué creemos'),
          ...about.bullets(
            'Una respuesta sin pruebas es una suposición bien redactada.',
            'La incertidumbre es información. Ocultarla es un error.',
            'La mejor interfaz para un modelo es la que facilita comprobarlo.',
          ),
          about.h2('Cómo trabajamos'),
          about.p(
            'Investigadores, ingenieros y diseñadores trabajan en los mismos equipos pequeños. Cada cambio de modelo se publica con un informe de evaluación y cada cambio de interfaz, con una prueba de usabilidad. Puedes leer lo que estamos aprendiendo en nuestras [notas de investigación](/blog).',
          ),
        ],
      },
      {
        _key: 'about-stats',
        _type: 'stats',
        items: [
          { _key: 'a1', value: '24', label: 'investigadores e ingenieros' },
          { _key: 'a2', value: '3', label: 'continentes' },
          {
            _key: 'a3',
            value: '1',
            label: 'pregunta que hacemos a cada modelo: ¿cómo lo sabes?',
          },
        ],
      },
      {
        _key: 'about-cta',
        _type: 'cta',
        heading: 'Lee en qué estamos trabajando',
        body: 'Lanzamientos, notas de evaluación y la ingeniería detrás de nuestras interfaces.',
        link: { label: 'Ver la investigación', href: '/blog' },
      },
    ],
  },
]

const launch = createPortableText('lanzamiento')
const calibration = createPortableText('calibracion')
const traces = createPortableText('trazas')

export const posts: PostInput[] = [
  {
    title: 'Cómo renderizamos las trazas de razonamiento en el navegador',
    slug: 'como-renderizamos-trazas-de-razonamiento',
    excerpt:
      'Una traza puede tener miles de pasos. Así mantenemos el visor rápido, accesible y legible en un teléfono.',
    publishedAt: '2026-11-05T09:00:00.000Z',
    author: { name: 'Lena Park', role: 'Ingeniería de diseño' },
    tags: ['Ingeniería', 'Interfaces'],
    body: [
      traces.p(
        'Una traza de razonamiento es un árbol de pasos: afirmaciones, las pruebas que las respaldan y las comprobaciones que hizo el modelo por el camino. Las tareas de investigación largas producen trazas con varios miles de nodos. Renderizarlas todas a la vez bloqueaba durante segundos los teléfonos de gama media, así que rehicimos el visor en torno a tres ideas.',
      ),
      traces.h2('Renderizar lo que está en pantalla'),
      traces.p(
        'Las ramas plegadas no cuestan nada y las desplegadas se virtualizan: solo existen en el DOM las filas cercanas a la ventana visible. Para las secciones que quedan más abajo confiamos en el navegador con **content-visibility: auto**, que omite el diseño y el pintado hasta que la sección está a punto de aparecer.',
      ),
      traces.h2('Transmitir el árbol, no la página'),
      traces.p(
        'Las trazas llegan como un flujo. En lugar de esperar al árbol completo, el visor añade los pasos según llegan y mantiene estable la posición de lectura. Un paso que sigue en curso se anuncia una sola vez a los lectores de pantalla, no con cada token.',
      ),
      traces.h2('Primero el teclado'),
      ...traces.bullets(
        'Las flechas recorren los pasos con un tabindex itinerante, así el árbol es una sola parada de tabulación, no miles.',
        'Izquierda y derecha pliegan y despliegan ramas, igual que en un árbol de archivos.',
        'Cada paso tiene una URL estable, así quien revisa puede compartir la afirmación exacta con la que no está de acuerdo.',
      ),
      traces.quote(
        'Si quien revisa no llega al paso importante con unas pocas teclas, es como si la traza no existiera.',
      ),
      traces.h2('Qué medimos'),
      traces.p(
        'Medimos Interaction to Next Paint en dispositivos reales al desplegar una rama y al saltar entre pasos. Ambos se mantienen por debajo de 100 ms en el percentil 75, incluso con trazas de diez mil pasos.',
      ),
    ],
  },
  {
    title: 'Presentamos Orrery Apogee',
    slug: 'presentamos-apogee',
    excerpt:
      'Nuestro modelo más capaz hasta ahora, con trazas de razonamiento auditables paso a paso y un contexto de un millón de tokens.',
    publishedAt: '2026-10-14T09:00:00.000Z',
    author: { name: 'Mara Ellison', role: 'Directora de investigación' },
    tags: ['Modelos', 'Lanzamiento'],
    body: [
      launch.p(
        'Hoy lanzamos Apogee, el modelo más grande de la familia Orrery. Está pensado para el trabajo en el que equivocarse sale caro: investigación, análisis y decisiones que alguien tendrá que defender más adelante.',
      ),
      launch.h2('Qué hay de nuevo'),
      ...launch.bullets(
        '**Razonamiento más profundo.** Apogee sigue mejorando cuando le das más presupuesto de razonamiento, mucho después de que los modelos pequeños se estabilicen.',
        '**Trazas auditables.** Cada respuesta enlaza cada afirmación con las pruebas y comprobaciones que la respaldan.',
        '**Un millón de tokens de contexto.** Las citas señalan el pasaje exacto, no solo el documento.',
      ),
      launch.h2('Trazas, no transcripciones'),
      launch.p(
        'Una cadena de pensamiento en bruto es larga y difícil de revisar. Apogee genera en su lugar una traza estructurada: un árbol de afirmaciones con las pruebas de cada una. Quien revisa puede ir directo al paso que le genera dudas, y la interfaz marca las afirmaciones de las que el propio modelo estaba menos seguro.',
      ),
      launch.h2('Disponibilidad'),
      launch.p(
        'Apogee ya está disponible en todos los planes. Compáralo con Perigee y Meridian en la [página de modelos](/modelos).',
      ),
    ],
  },
  {
    title: 'Por qué la calibración importa más que la precisión',
    slug: 'calibracion-antes-que-precision',
    excerpt:
      'Un modelo que sabe cuándo puede equivocarse es más útil que uno un poco más preciso pero siempre seguro de sí mismo.',
    publishedAt: '2026-09-02T09:00:00.000Z',
    author: { name: 'Daniel Okafor', role: 'Evaluación' },
    tags: ['Evaluación'],
    body: [
      calibration.p(
        'Imagina dos modelos. El primero acierta el 90 % de las veces y siempre suena seguro. El segundo acierta el 88 %, pero te dice cuánta seguridad tiene, y ese número es honesto. Para la mayoría de los flujos de trabajo reales, el segundo es mejor producto.',
      ),
      calibration.h2('Qué significa calibración'),
      calibration.p(
        'Un modelo está calibrado cuando su confianza coincide con su precisión. De todas las respuestas que da con un 70 % de confianza, alrededor del 70 % deberían ser correctas. Medimos la diferencia con el **error de calibración esperado** y tratamos un empeoramiento con la misma seriedad que una caída de precisión.',
      ),
      calibration.h2('Por qué cambia el producto'),
      ...calibration.numbers(
        'Las respuestas con poca confianza pueden pasar a una persona automáticamente, en lugar de revisar todas.',
        'Cada equipo fija su propio umbral por tarea, estricto para textos legales y flexible para borradores.',
        'Los usuarios aprenden cuándo comprobar, y eso crea el tipo de confianza adecuado.',
      ),
      calibration.h2('Cómo lo evaluamos'),
      calibration.p(
        'Cada versión de Orrery se publica con un informe de fiabilidad sobre tareas reservadas. Puedes ver cómo se alinean confianza y precisión en cada modelo en la [página de modelos](/modelos).',
      ),
    ],
  },
]
