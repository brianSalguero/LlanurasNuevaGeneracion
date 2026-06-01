"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { AnimatePresence, motion } from "framer-motion";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// ================= ICONOS =================
const iconDanza = new Icon({
  iconUrl: "/icons/danza.png",
  iconSize: [30, 30],
});

// ================= TYPES =================
type Imagen = {
  url: string;
  autor?: string;
  fuente?: string;
  licencia?: string;
  link?: string;
};

type BaseItem = {
  nombre: string;
  posicion: LatLngExpression;
  lugar_origen: string;
  resumen: string;
  historia: string;
  imagen: Imagen;
  tipo: "Danza ecuatoriana";
  region: string;
};

// ================= DATA =================
export const data: BaseItem[] = [
  {
    nombre: "SANJUANITO",
    tipo: "Danza ecuatoriana",
    region: "Sierra norte",
    posicion: [0.2300, -78.2600],
    lugar_origen: "Imbabura, Otavalo y Sierra norte",
    resumen: "Danza tradicional mestiza e indígena de ritmo alegre y enérgico, considerada uno de los símbolos culturales más importantes del Ecuador. El sanjuanito representa la identidad de los pueblos andinos y se caracteriza por sus movimientos dinámicos, música festiva y coloridos trajes típicos que reflejan las costumbres ancestrales de la Sierra norte ecuatoriana.",

    historia: `El sanjuanito es una de las expresiones musicales y dancísticas más representativas del Ecuador andino. Su origen se remonta a las culturas indígenas prehispánicas de la Sierra norte, especialmente en las provincias de Imbabura y Otavalo, donde las comunidades realizaban ceremonias y rituales dedicados a la naturaleza, al sol y a la fertilidad de la tierra.

Con la llegada de los españoles durante la época colonial, esta danza fue transformándose mediante el mestizaje cultural. Los ritmos autóctonos se mezclaron con influencias musicales europeas, dando origen al sanjuanito que hoy se conoce. Su nombre proviene de las festividades de San Juan Bautista, celebradas en junio, las cuales coincidieron con las antiguas ceremonias indígenas del Inti Raymi.

El sanjuanito se caracteriza por su ritmo binario alegre y repetitivo, acompañado de pasos cortos y movimientos coordinados que pueden ejecutarse en pareja, en filas o en círculos grupales. Los bailarines suelen usar vestimentas tradicionales con bordados, sombreros, alpargatas y prendas de colores vivos que representan la riqueza cultural de los pueblos andinos.

Esta danza tiene un profundo significado espiritual y comunitario. Tradicionalmente se interpreta durante fiestas indígenas, celebraciones agrícolas y festividades populares como el Inti Raymi, donde las comunidades agradecen a la Pachamama por las cosechas y la abundancia. Además de ser una manifestación artística, el sanjuanito fortalece la unión social y preserva las tradiciones ancestrales transmitidas de generación en generación.

La música del sanjuanito utiliza instrumentos típicos andinos como rondadores, quenas, flautas, guitarras, charangos, bombos y otros instrumentos de percusión. Sus melodías suelen transmitir alegría, orgullo cultural y conexión con la tierra.

En la actualidad, el sanjuanito es reconocido como un símbolo nacional del Ecuador y ha trascendido fronteras, siendo interpretado en festivales culturales internacionales y escenarios folklóricos de diferentes países. Su permanencia a lo largo del tiempo demuestra la importancia de las raíces indígenas y mestizas dentro de la identidad ecuatoriana.`,

    imagen: {
      url: "/images/sanjuanito.jpg",
    },
  },
  {
    nombre: "MARIMBA - ESMERALDAS",
    tipo: "Danza ecuatoriana",
    region: "Costa",
    posicion: [0.9592, -79.6539],
    lugar_origen: "Provincia de Esmeraldas, Ecuador",
    resumen: "La marimba de Esmeraldas es una expresión cultural afroecuatoriana donde música, canto y danza se unen alrededor de un instrumento de percusión de origen africano. Representa identidad, resistencia y alegría del pueblo afrodescendiente en la provincia de Esmeraldas, Ecuador.",
    historia:
      `La marimba esmeraldeña es una de las manifestaciones culturales más importantes del pueblo afroecuatoriano en la provincia de Esmeraldas. No se trata solo de un instrumento musical, sino de un sistema cultural completo que integra música, danza, canto y convivencia comunitaria.

Su origen se relaciona con las tradiciones africanas traídas por personas esclavizadas durante la colonia, que con el tiempo se adaptaron al entorno del litoral ecuatoriano. En este proceso se incorporaron materiales locales como la madera de chonta, el bambú y otros elementos naturales para construir el instrumento y sus resonadores.

La marimba está compuesta por varios instrumentos: la propia marimba (tipo xilófono de madera), el bombo, los cununos (tambores), el guasá y las maracas. Todos ellos se combinan para crear ritmos que acompañan cantos tradicionales y danzas colectivas.

Más que música, la marimba cumple una función social y espiritual. Se interpreta en fiestas, rituales, celebraciones religiosas y encuentros comunitarios, fortaleciendo la identidad y la unión entre familias y comunidades. En muchos casos, también se considera una forma de conexión con los ancestros y una expresión de memoria histórica.

Uno de los ritmos más representativos asociados a la marimba es el currulao, una danza vibrante y energética donde la percusión y el movimiento corporal se combinan en una expresión de alegría, resistencia y orgullo cultural.

Hoy en día, la marimba es considerada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO, y sigue siendo un símbolo vivo de la cultura afrodescendiente en Ecuador, especialmente en Esmeraldas, donde continúa transmitiéndose de generación en generación.`,
    imagen: {
      url: "/images/marimba.jpg",
    },
  },
  {
    nombre: "BOMBA DEL CHOTA",
    tipo: "Danza ecuatoriana",
    region: "Sierra norte (Valle del Chota)",
    posicion: [0.4700, -78.0600],
    lugar_origen: "Valle del Chota, Imbabura - Carchi",

    resumen: "Danza afroandina tradicional del Ecuador caracterizada por su ritmo fuerte, alegre y sensual, acompañada principalmente por tambores, guitarras y canto popular. La bomba del Chota representa la identidad cultural y la resistencia histórica del pueblo afroecuatoriano del valle del Chota, destacándose por sus movimientos enérgicos, el zapateo y la expresión festiva de sus comunidades.",

    historia: `La bomba del Chota es una de las expresiones culturales más importantes del pueblo afroecuatoriano asentado en el valle interandino del Chota, ubicado entre las provincias de Imbabura y Carchi, en la Sierra norte del Ecuador. Su origen está profundamente ligado a la historia de las comunidades africanas traídas durante la época colonial para trabajar en haciendas y plantaciones de la región.

A lo largo de los siglos, los descendientes afroecuatorianos conservaron parte de sus tradiciones musicales y rítmicas africanas, mezclándolas con influencias indígenas y mestizas propias de la región andina. De esta fusión cultural nació la bomba del Chota, una manifestación artística que expresa alegría, identidad, resistencia y sentido de comunidad.

El elemento principal de esta danza y música es el tambor conocido como “bomba”, instrumento de percusión elaborado artesanalmente con madera y cuero, encargado de marcar el ritmo característico de las canciones. Este sonido se complementa con guitarras, maracas, palmadas y cantos populares que relatan historias cotidianas, sentimientos, costumbres y experiencias de vida del pueblo afrodescendiente.

La danza de la bomba se caracteriza por ser libre, expresiva y llena de energía. Los bailarines realizan movimientos de cadera, giros, pasos rápidos y zapateos que reflejan vitalidad y conexión con la música. En muchas ocasiones, las parejas improvisan pasos y demuestran habilidad manteniendo equilibrio y coordinación durante la celebración.

Tradicionalmente, la bomba del Chota se interpreta en fiestas populares, reuniones familiares, festividades religiosas, encuentros comunitarios y celebraciones locales. Más que una danza, representa un espacio de unión social, memoria histórica y transmisión cultural entre generaciones.

Con el paso del tiempo, la bomba del Chota ha ganado reconocimiento nacional e internacional como símbolo del patrimonio afroecuatoriano. Diversos grupos musicales y culturales han contribuido a difundir esta tradición en escenarios artísticos y festivales folklóricos, fortaleciendo el orgullo y la visibilidad de la cultura afrodescendiente en el Ecuador.

Actualmente, la bomba continúa siendo una de las expresiones más vivas y representativas de la identidad afroecuatoriana en la Sierra, preservando la memoria, la música y las raíces históricas de las comunidades del valle del Chota.`,

    imagen: {
      url: "/images/bomba.png",
    },
  },

  {
    nombre: "DANZANTE DE PUJILÍ",
    tipo: "Danza ecuatoriana",
    region: "Sierra centro",
    posicion: [-0.9300, -78.6900],
    lugar_origen: "Pujilí, Cotopaxi",

    resumen: "Danza ceremonial indígena de gran importancia cultural en el Ecuador andino, reconocida por sus coloridos trajes, enormes penachos y máscaras decorativas. El danzante de Pujilí combina elementos espirituales, religiosos y agrícolas, representando la conexión entre las tradiciones ancestrales de los pueblos indígenas y las festividades católicas heredadas de la época colonial.",

    historia: `El danzante de Pujilí es una de las expresiones rituales y folklóricas más emblemáticas del Ecuador andino. Su origen se encuentra en las antiguas ceremonias indígenas de los pueblos de la Sierra centro, especialmente en la actual provincia de Cotopaxi, donde las comunidades realizaban rituales dedicados a la naturaleza, las cosechas y las divinidades andinas.

Con la llegada de los españoles durante la época colonial, muchas de estas celebraciones ancestrales fueron incorporadas al calendario religioso católico. De esta mezcla cultural nació la tradición del danzante de Pujilí, que hoy forma parte importante de festividades religiosas como el Corpus Christi y otras celebraciones populares de la región.

Los danzantes destacan por sus impresionantes vestimentas llenas de colores, bordados, espejos, cintas y figuras decorativas. El elemento más representativo es el gran penacho o tocado que llevan sobre la cabeza, elaborado con plumas, adornos brillantes y estructuras altas que simbolizan autoridad espiritual, conexión con el mundo sagrado y respeto hacia los antepasados.

Durante la danza, los participantes realizan movimientos ceremoniales acompañados de música tradicional andina interpretada con flautas, tambores, pingullos y otros instrumentos autóctonos. Los pasos suelen ser pausados y simbólicos, reflejando solemnidad, espiritualidad y armonía con la naturaleza.

El danzante de Pujilí no solo es una manifestación artística, sino también una representación de identidad cultural y memoria histórica de los pueblos indígenas de Cotopaxi. Cada traje, color y adorno posee un significado especial relacionado con la cosmovisión andina, las fuerzas de la naturaleza y la relación entre el ser humano y lo divino.

Tradicionalmente, esta danza se presenta en procesiones religiosas, plazas y espacios comunitarios, donde los danzantes rinden homenaje tanto a las creencias católicas como a las antiguas tradiciones indígenas. Las comunidades participan activamente en la preparación de los trajes y las ceremonias, fortaleciendo la unión social y la transmisión de conocimientos ancestrales entre generaciones.

En la actualidad, el danzante de Pujilí es considerado uno de los símbolos culturales más representativos de la Sierra centro del Ecuador y forma parte del patrimonio folklórico nacional. Su presencia en festivales culturales y eventos tradicionales mantiene viva una herencia histórica que refleja la riqueza espiritual y artística de los pueblos andinos.`,

    imagen: {
      url: "/images/danzantes.jpg",
    },
  },

  {
    nombre: "DIABLADA PILLAREÑA",
    tipo: "Danza ecuatoriana",
    region: "Sierra centro",
    posicion: [-1.1700, -78.5300],
    lugar_origen: "Píllaro, Tungurahua",

    resumen: "Danza tradicional ecuatoriana caracterizada por la presencia de diablos enmascarados que recorren las calles con música y comparsas festivas. La Diablada Pillareña simboliza la rebeldía, la resistencia cultural y la sátira popular frente a la autoridad colonial y religiosa, convirtiéndose en una de las celebraciones folklóricas más representativas de la Sierra centro del Ecuador.",

    historia: `La Diablada Pillareña es una de las manifestaciones culturales más emblemáticas y coloridas del Ecuador andino. Su origen se encuentra en el cantón Píllaro, en la provincia de Tungurahua, donde esta tradición ha sido transmitida de generación en generación como símbolo de identidad, resistencia y expresión popular.

El origen de la diablada está relacionado con la época colonial, cuando los pueblos indígenas y campesinos utilizaban las festividades y disfraces como una forma simbólica de protesta frente a los abusos de las autoridades españolas y religiosas. A través de las máscaras de diablos y personajes extravagantes, las comunidades expresaban rebeldía, sátira social y deseo de libertad, burlándose del poder establecido de manera festiva y artística.

La celebración se desarrolla principalmente durante los primeros días de enero, especialmente entre el 1 y el 6 de enero, cuando las calles de Píllaro se llenan de música, danza y comparsas. Los participantes recorren la ciudad bailando al ritmo de bandas populares, mientras realizan movimientos enérgicos y espontáneos que transmiten alegría y fuerza colectiva.

Uno de los elementos más representativos de esta danza son las máscaras de diablos, elaboradas artesanalmente con gran creatividad y detalle. Estas máscaras suelen tener cuernos grandes, colmillos, colores intensos y expresiones exageradas. Algunas representan figuras aterradoras, mientras que otras tienen rasgos burlones o caricaturescos, reflejando la mezcla entre humor, tradición y simbolismo cultural.

Además de los diablos, en las comparsas participan otros personajes tradicionales como guarichas, capariches y parejas de línea, cada uno con un papel específico dentro de la celebración. Los trajes son coloridos y llamativos, acompañados de accesorios que aumentan el carácter festivo de la diablada.

La Diablada Pillareña también posee un profundo significado comunitario y espiritual. Más allá del entretenimiento, representa la memoria histórica de los pueblos andinos y la preservación de costumbres ancestrales que han sobrevivido al paso del tiempo. La preparación de las máscaras, la música y las danzas fortalece la unión entre familias y comunidades locales.

En la actualidad, esta celebración es considerada Patrimonio Cultural Inmaterial del Ecuador y atrae a miles de visitantes nacionales e internacionales cada año. La Diablada Pillareña continúa siendo una de las expresiones folklóricas más vivas del país, destacándose por su riqueza artística, su energía festiva y su importante valor histórico y cultural.`,

    imagen: {
      url: "/images/diablada.jpg",
    },
  },
  {
    nombre: "CAPISHCA",
    tipo: "Danza ecuatoriana",
    region: "Sierra centro",
    posicion: [-1.6700, -78.6500],
    lugar_origen: "Chimborazo, Ecuador",

    resumen: "Danza tradicional andina de ritmo alegre y dinámico, originaria de la Sierra central del Ecuador. El capishca combina influencias indígenas y mestizas, destacándose por sus movimientos rápidos, zapateos y giros festivos que expresan energía, unión comunitaria y celebración popular en las comunidades de Chimborazo y otras provincias andinas.",

    historia: `El capishca es una de las danzas folklóricas más representativas de la Sierra central del Ecuador, especialmente de la provincia de Chimborazo, donde forma parte importante de las tradiciones culturales y festivas de las comunidades andinas. Su origen se relaciona con las celebraciones indígenas agrícolas y las expresiones populares mestizas que surgieron durante la época colonial.

El término “capishca” proviene del kichwa y se asocia con la idea de apretar o exprimir, haciendo referencia a la energía y fuerza de los movimientos de la danza. Con el paso del tiempo, esta expresión artística fue integrando elementos musicales europeos e indígenas, dando lugar a un estilo festivo caracterizado por su ritmo rápido y alegre.

Tradicionalmente, el capishca se interpreta durante fiestas populares, celebraciones patronales, matrimonios, cosechas y eventos comunitarios donde las personas se reúnen para compartir música, danza y comida. Estas celebraciones fortalecen la unión social y mantienen vivas las costumbres ancestrales de los pueblos andinos.

La danza se ejecuta generalmente en parejas o en grupos coordinados. Los bailarines realizan movimientos ágiles, giros constantes, saltos y zapateos marcados que reflejan entusiasmo, vitalidad y espíritu festivo. En muchas ocasiones, los hombres demuestran fuerza y destreza, mientras las mujeres acompañan los movimientos con elegancia y ritmo armónico.

La música del capishca se caracteriza por ser rápida y alegre, interpretada con instrumentos tradicionales como guitarras, acordeones, violines, bombos y rondadores. Las melodías suelen transmitir felicidad y motivan la participación colectiva durante las festividades.

La vestimenta típica del capishca también tiene gran importancia cultural. Los hombres suelen vestir ponchos, sombreros y pantalones tradicionales, mientras que las mujeres usan polleras bordadas, blusas coloridas y accesorios representativos de la región andina. Los colores vivos y los detalles artesanales reflejan la riqueza cultural de las comunidades de la Sierra.

Además de ser una expresión artística, el capishca simboliza la mezcla cultural entre las raíces indígenas y las influencias mestizas que forman parte de la identidad ecuatoriana. Su práctica ha sido transmitida de generación en generación, convirtiéndose en un patrimonio vivo que preserva la memoria histórica y las tradiciones populares de Chimborazo y del Ecuador andino.

En la actualidad, el capishca continúa presentándose en festivales folklóricos, eventos culturales y celebraciones comunitarias dentro y fuera del país, siendo reconocido como una de las danzas más alegres y representativas de la Sierra ecuatoriana.`,

    imagen: {
      url: "/images/capishca.jpg",
    },
  },
  {
    nombre: "AMORFINO (BAILE MONTUBIO)",
    tipo: "Danza ecuatoriana",
    region: "Costa",
    posicion: [-0.9500, -80.7300],
    lugar_origen: "Manabí y Guayas rural",

    resumen: "Expresión cultural tradicional del pueblo montubio de la Costa ecuatoriana que combina danza, poesía oral, música y humor popular campesino. El amorfino destaca por sus coplas improvisadas llenas de picardía, amor y crítica social, acompañadas de un baile sencillo y festivo que representa la identidad y las costumbres rurales de la región costera del Ecuador.",

    historia: `El amorfino es una de las expresiones culturales más representativas del pueblo montubio de la Costa ecuatoriana, especialmente en las provincias rurales de Manabí y Guayas. Más que una simple danza, el amorfino es una tradición oral que une poesía popular, música, improvisación y baile dentro de las celebraciones campesinas.

Sus raíces provienen de la mezcla entre las tradiciones españolas traídas durante la colonia y las costumbres locales de las comunidades costeñas. Con el paso del tiempo, los campesinos montubios desarrollaron un estilo propio de expresión artística basado en coplas improvisadas que reflejan la vida cotidiana, el amor, el humor, la naturaleza y las relaciones sociales.

El baile del amorfino se interpreta generalmente en pareja, con movimientos sencillos, alegres y espontáneos. Los bailarines realizan pasos suaves, vueltas y gestos de coqueteo mientras interactúan con las coplas cantadas o recitadas. La danza suele transmitir alegría, picardía y cercanía entre los participantes.

Uno de los elementos más importantes del amorfino son las coplas improvisadas, que pueden incluir bromas, declaraciones amorosas, críticas sociales y desafíos verbales entre hombres y mujeres. Estas composiciones populares demuestran creatividad, ingenio y habilidad para improvisar frente al público.

La música que acompaña al amorfino suele interpretarse con guitarras y otros instrumentos tradicionales de la Costa ecuatoriana. En fiestas rurales y encuentros comunitarios, las personas se reúnen para cantar, bailar y compartir esta tradición como parte de la convivencia social.

El amorfino representa la identidad cultural montubia y la riqueza de la tradición oral campesina. A través de sus versos y danzas, las comunidades transmiten conocimientos, costumbres y formas de ver la vida de generación en generación.

Actualmente, esta manifestación cultural continúa viva en festivales folklóricos, rodeos montubios y celebraciones populares de la Costa ecuatoriana, siendo reconocida como parte importante del patrimonio cultural del Ecuador.`,

    imagen: {
      url: "/images/amorfino.jpg",
    },
  },
  {
    nombre: "DANZA SHUAR",
    tipo: "Danza ecuatoriana",
    region: "Amazonía",
    posicion: [-2.3000, -78.1200],
    lugar_origen: "Morona Santiago y Zamora Chinchipe",

    resumen: "Danza ceremonial ancestral de los pueblos Shuar de la Amazonía ecuatoriana, vinculada a rituales espirituales, actividades de caza, guerra y celebraciones comunitarias. Sus movimientos y cantos representan la relación profunda entre el ser humano, la naturaleza y los espíritus de la selva, formando parte esencial de la cosmovisión amazónica.",

    historia: `Las danzas shuar forman parte de las tradiciones ancestrales del pueblo Shuar, uno de los grupos indígenas más representativos de la Amazonía ecuatoriana. Estas expresiones culturales se han conservado durante siglos como parte fundamental de su identidad, espiritualidad y organización comunitaria.

Desde tiempos antiguos, las comunidades Shuar han utilizado la danza como medio de comunicación con los espíritus de la naturaleza y como parte de rituales relacionados con la guerra, la caza, la protección espiritual y las celebraciones colectivas. Cada movimiento y canto posee un significado especial dentro de la cosmovisión amazónica.

Las danzas se realizan en ceremonias tradicionales, rituales de iniciación, encuentros familiares y festividades comunitarias. En muchos casos, los participantes se preparan espiritualmente antes de bailar, utilizando pinturas corporales, coronas de plumas y adornos elaborados con materiales naturales de la selva.

Los movimientos de la danza suelen imitar animales, acciones de caza, desplazamientos por la selva y escenas relacionadas con la vida cotidiana amazónica. Estas representaciones expresan valentía, fuerza, armonía y respeto hacia el entorno natural.

La música tradicional shuar se acompaña con tambores, instrumentos de percusión y cantos colectivos que mantienen ritmos repetitivos y ceremoniales. Los cantos transmiten historias ancestrales, enseñanzas y mensajes espirituales relacionados con la comunidad y la naturaleza.

La danza tiene un fuerte componente espiritual, ya que para el pueblo Shuar la selva posee vida y energía propia. A través de estas ceremonias, las comunidades buscan mantener equilibrio con los espíritus protectores y agradecer los recursos que ofrece la naturaleza.

Además de su función ritual, las danzas shuar fortalecen la unión social y permiten transmitir conocimientos culturales entre generaciones. Los mayores enseñan a los jóvenes los pasos, significados y valores asociados a cada ceremonia.

En la actualidad, las danzas shuar continúan siendo una manifestación viva de la identidad amazónica ecuatoriana y son presentadas en festivales culturales, encuentros indígenas y eventos interculturales que promueven el respeto y la preservación de las culturas ancestrales del Ecuador.`,

    imagen: {
      url: "/images/danza_shuar.jpg",
    },
  },
  {
    nombre: "DANZA KICHWA AMAZÓNICA",
    tipo: "Danza ecuatoriana",
    region: "Amazonía",
    posicion: [-1.4900, -77.9900],
    lugar_origen: "Pastaza, Napo, Orellana",

    resumen: "Conjunto de danzas tradicionales de las comunidades Kichwa amazónicas del Ecuador que expresan la conexión espiritual y comunitaria con la selva, los animales, los ríos y la naturaleza. Estas manifestaciones culturales combinan música, canto y movimientos simbólicos que representan la armonía entre el ser humano y el mundo natural.",

    historia: `Las danzas kichwa amazónicas forman parte de las tradiciones ancestrales de los pueblos indígenas Kichwa asentados en las provincias amazónicas de Pastaza, Napo y Orellana. Estas expresiones culturales han sido transmitidas oralmente durante generaciones como parte de la identidad y cosmovisión de las comunidades amazónicas.

Desde tiempos antiguos, las comunidades Kichwa han utilizado la danza en rituales, celebraciones comunitarias, ceremonias espirituales y actividades relacionadas con la agricultura, la caza y la convivencia social. Para los pueblos amazónicos, bailar es una forma de comunicarse con la naturaleza y agradecer a los espíritus protectores de la selva.

Los movimientos de estas danzas suelen imitar animales, aves, ríos y elementos naturales del entorno amazónico. Cada gesto tiene un significado simbólico relacionado con la vida en la selva, la supervivencia y el equilibrio espiritual entre los seres humanos y la naturaleza.

La música se acompaña con instrumentos tradicionales elaborados artesanalmente, además de cantos colectivos interpretados por hombres y mujeres de la comunidad. Los ritmos suelen ser repetitivos y ceremoniales, creando un ambiente espiritual y de integración comunitaria.

Las vestimentas tradicionales incluyen coronas de plumas, collares de semillas, pinturas corporales y adornos hechos con materiales naturales. Estos elementos representan la conexión cultural y espiritual con el territorio amazónico.

Las danzas kichwa también cumplen una función educativa y social, ya que permiten transmitir conocimientos ancestrales, historias, costumbres y valores culturales a las nuevas generaciones. Durante las ceremonias, los mayores enseñan el significado de los movimientos y la importancia del respeto hacia la naturaleza.

Además de su dimensión espiritual, estas danzas fortalecen la identidad colectiva de las comunidades Kichwa y promueven la unión entre familias y pueblos amazónicos. Las celebraciones suelen realizarse en espacios comunitarios donde participan niños, jóvenes y adultos.

En la actualidad, la danza kichwa amazónica continúa siendo una expresión viva de la cultura indígena ecuatoriana y se presenta en encuentros culturales, festivales interculturales y actividades de preservación del patrimonio ancestral de la Amazonía.`,

    imagen: {
      url: "/images/danza_kichwa.jpg",
    },
  },
  {
    nombre: "PASACALLE ECUATORIANO (BAILE FESTIVO)",
    tipo: "Danza ecuatoriana",
    region: "Sierra y Costa",
    posicion: [-0.2200, -78.5120],
    lugar_origen: "Ecuador andino-mestizo",

    resumen: "Baile festivo tradicional del Ecuador caracterizado por su ritmo alegre y elegante, influenciado por marchas europeas adaptadas a la cultura mestiza andina y costeña. El pasacalle se interpreta en desfiles, fiestas cívicas y celebraciones populares, representando alegría, identidad nacional y espíritu comunitario.",

    historia: `El pasacalle ecuatoriano es una de las expresiones musicales y dancísticas más populares del país, presente tanto en la Sierra como en la Costa. Su origen proviene de antiguas marchas y pasodobles europeos introducidos durante la época colonial, los cuales fueron adaptados por las comunidades mestizas ecuatorianas hasta adquirir un estilo propio y nacional.

Con el paso del tiempo, el pasacalle evolucionó incorporando ritmos andinos, melodías populares y formas de baile tradicionales del Ecuador. Esta mezcla cultural dio lugar a una danza alegre y festiva que actualmente forma parte importante de las celebraciones públicas y comunitarias.

Tradicionalmente, el pasacalle se interpreta durante desfiles, fiestas patronales, celebraciones cívicas, eventos escolares y festividades populares. Su música suele acompañar momentos de encuentro colectivo, alegría y orgullo cultural en diferentes regiones del país.

La danza se ejecuta en parejas o grupos coordinados, realizando movimientos elegantes y dinámicos al ritmo de la música. Los bailarines avanzan con pasos marcados, vueltas y desplazamientos sincronizados que reflejan entusiasmo y carácter festivo.

La música del pasacalle se interpreta con bandas populares e instrumentos como trompetas, clarinetes, bombos, guitarras y otros instrumentos tradicionales. Las melodías suelen ser alegres y fáciles de reconocer, convirtiéndose en parte importante del repertorio musical ecuatoriano.

En muchas ocasiones, los participantes utilizan vestimenta típica o trajes representativos de sus regiones, destacando la diversidad cultural del Ecuador. Esto convierte al pasacalle en una expresión artística que une diferentes tradiciones locales dentro de una misma celebración.

Además de su carácter festivo, el pasacalle simboliza identidad nacional, integración social y orgullo mestizo. A través de esta danza, las comunidades expresan sentimientos de pertenencia y celebran la riqueza cultural ecuatoriana.

En la actualidad, el pasacalle continúa siendo una de las danzas más difundidas y representativas del Ecuador, presente en festivales folklóricos, actos oficiales y celebraciones populares tanto dentro como fuera del país.`,

    imagen: {
      url: "/images/pasacalle.jpg",
    },
  },
  {
    nombre: "DIABLO HUMA",
    tipo: "Danza ecuatoriana",
    region: "Sierra (principalmente Chimborazo y Azuay)",
    posicion: [-1.6700, -78.6500],
    lugar_origen: "Sierra central del Ecuador (tradición indígena kichwa)",

    resumen: "Personaje ritual y ceremonial de las festividades andinas del Ecuador que simboliza la dualidad, la energía espiritual y la conexión entre el mundo ancestral indígena y la influencia colonial. El Diablo Huma es una figura emblemática de las comunidades kichwa de la Sierra central, presente en celebraciones como el Inti Raymi, el Carnaval y otras fiestas tradicionales andinas.",

    historia: `El Diablo Huma es una de las figuras más representativas de las celebraciones tradicionales andinas del Ecuador, especialmente en las comunidades kichwa de la Sierra central. Su presencia está profundamente ligada a las antiguas creencias indígenas y a la cosmovisión andina, donde los rituales y personajes ceremoniales simbolizan la conexión espiritual entre la humanidad, la naturaleza y el universo.

El nombre “Diablo Huma” tiene un origen relacionado con la época colonial. La palabra “huma” proviene del kichwa y significa cabeza, espíritu o guía espiritual, mientras que el término “diablo” fue incorporado por los españoles al interpretar erróneamente las representaciones rituales indígenas desde la visión cristiana europea. Sin embargo, para las comunidades andinas este personaje no representa el mal ni un demonio cristiano, sino una entidad ceremonial llena de energía, sabiduría y simbolismo ancestral.

Uno de los elementos más distintivos del Diablo Huma es su máscara de dos rostros o dos caras. Estas representan la dualidad del tiempo y de la existencia dentro de la cosmovisión andina: una cara mira al pasado y la otra al futuro, simbolizando equilibrio, memoria y continuidad cultural. Además, las máscaras suelen tener colores intensos, cuernos decorativos y detalles artesanales elaborados cuidadosamente por las comunidades.

El personaje utiliza vestimentas llamativas compuestas por capas bordadas, cintas de colores, cascabeles y grandes penachos. Cada elemento del traje tiene un significado relacionado con la espiritualidad, la naturaleza y la identidad indígena. Durante las celebraciones, el Diablo Huma destaca por sus movimientos ágiles, giros y pasos ceremoniales que acompañan las comparsas y danzas tradicionales.

El Diablo Huma aparece principalmente en festividades como el Inti Raymi, el Carnaval andino y fiestas comunitarias de agradecimiento agrícola. En estas celebraciones, su papel es guiar las comparsas, mantener el orden ritual y representar la energía protectora de la comunidad. También simboliza la conexión entre el mundo espiritual y el mundo terrenal.

A lo largo de los siglos, esta figura logró mantenerse viva a pesar de la influencia colonial y religiosa. Las comunidades indígenas conservaron su significado ancestral adaptándolo a las nuevas circunstancias históricas, convirtiéndolo en un símbolo de resistencia cultural y preservación de las tradiciones andinas.

En la actualidad, el Diablo Huma es reconocido como una de las expresiones culturales más importantes del Ecuador indígena. Su presencia en festivales folklóricos, ceremonias tradicionales y eventos culturales refleja la riqueza espiritual y artística de los pueblos andinos, además de fortalecer la identidad y memoria histórica de las comunidades kichwa.`,

    imagen: {
      url: "/images/diablo_huma.jpg",
    },
  },
  {
    nombre: "CAYAMBEÑAS",
    tipo: "Danza ecuatoriana",
    region: "Sierra norte (Imbabura - Pichincha)",
    posicion: [0.0290, -78.1440],
    lugar_origen: "Cayambe, Sierra norte del Ecuador (tradición indígena kichwa)",

    resumen: "Danza tradicional de la región de Cayambe que representa la identidad cultural de los pueblos kichwa de la Sierra norte ecuatoriana. Las cayambeñas forman parte de las celebraciones agrícolas, comunitarias y festivas andinas, destacándose por sus movimientos colectivos, música tradicional y coloridas vestimentas que reflejan la conexión con la naturaleza y la vida comunitaria.",

    historia: `Las cayambeñas son una de las expresiones culturales más representativas de la región de Cayambe, ubicada en la Sierra norte del Ecuador. Esta danza tradicional tiene raíces ancestrales vinculadas a las comunidades indígenas kichwa que habitan la zona y forma parte importante de su identidad cultural y espiritual.

Desde tiempos prehispánicos, las comunidades andinas realizaban ceremonias y celebraciones relacionadas con los ciclos agrícolas, las cosechas y el agradecimiento a la naturaleza. Dentro de estas festividades surgieron manifestaciones musicales y dancísticas que con el paso del tiempo dieron origen a las cayambeñas, conservando elementos propios de la cosmovisión indígena.

La danza está estrechamente relacionada con el trabajo comunitario, la armonía social y el respeto hacia la Pachamama o Madre Tierra. Los movimientos colectivos simbolizan unidad, cooperación y equilibrio entre las personas y la naturaleza, valores fundamentales dentro de la cultura kichwa.

Las cayambeñas suelen interpretarse durante celebraciones tradicionales como el Inti Raymi, fiestas de cosecha, eventos comunitarios y festividades locales de la región de Cayambe. En estas ocasiones, hombres y mujeres participan juntos en coreografías grupales acompañadas de música andina interpretada con rondadores, flautas, guitarras, bombos y otros instrumentos tradicionales.

La vestimenta típica es uno de los elementos más llamativos de esta danza. Las mujeres utilizan blusas bordadas, anacos, collares y sombreros tradicionales, mientras que los hombres visten ponchos, pantalones blancos y accesorios representativos de la cultura andina. Los colores vivos y los detalles artesanales reflejan la riqueza cultural de las comunidades de la Sierra norte.

Los pasos de las cayambeñas son coordinados y festivos, combinando desplazamientos grupales, giros y movimientos suaves que expresan alegría y sentido de pertenencia comunitaria. En muchas ocasiones, la danza también sirve como espacio de encuentro social y fortalecimiento cultural entre generaciones.

Durante la época colonial, algunas de estas celebraciones fueron adaptadas al calendario religioso católico, pero las comunidades indígenas lograron conservar gran parte de sus tradiciones originales. Gracias a ello, las cayambeñas continúan siendo una manifestación viva de la memoria histórica y espiritual de los pueblos kichwa.

En la actualidad, esta danza es reconocida como parte del patrimonio cultural inmaterial de la Sierra norte ecuatoriana y sigue presente en festivales folklóricos, eventos interculturales y celebraciones comunitarias que buscan preservar y difundir las tradiciones ancestrales del Ecuador andino.`,

    imagen: {
      url: "/images/image1.jpg",
    },
  }
];

// ================= CENTER =================
const center: LatLngExpression = [-1.8, -78.2];

export default function HistoriaMap() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<BaseItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
  }, [active]);

  const filtered = data;

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* ================= MAPA ================= */}
      <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <MapContainer
          center={center}
          zoom={6}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          {filtered.map((item, i) => (
            <Marker
              key={i}
              position={item.posicion}
              icon={iconDanza}
            >
              <Popup>
                <div className="w-64 space-y-3">

                  <img
                    src={item.imagen.url}
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  <h3 className="font-bold text-lg">{item.nombre}</h3>

                  <p className="text-sm text-slate-700">{item.resumen}</p>

                  <button
                    onClick={() => setActive(item)}
                    className="w-full py-2 rounded-xl text-white bg-amber-500 hover:bg-amber-600"
                  >
                    Explorar historia
                  </button>

                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-lg flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-5xl h-[92vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >

              {/* HEADER */}
              <div className="p-5 flex justify-between border-b">
                <div>
                  <h2 className="text-2xl font-bold">{active.nombre}</h2>
                  <p className="text-sm text-slate-500">
                    {active.region}
                  </p>
                </div>

                <button onClick={() => setActive(null)}>✕</button>
              </div>

              {/* BODY */}
              <div className="overflow-y-auto p-6 space-y-6">

                <img
                  src={active.imagen.url}
                  className="w-full h-60 object-contain rounded-2xl"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    Región: <b>{active.region}</b>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    Lugar de origen: <b>{active.lugar_origen || "No especificado"}</b>
                  </div>
                </div>

                <div>
                  <h3 className="text-amber-500 font-bold mb-2">
                    Historia cultural
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {active.historia}
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}