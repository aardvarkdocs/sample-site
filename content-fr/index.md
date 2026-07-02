---
description: aardvark est un générateur de site statique propulsé par Mantine — rédigez
  en Markdown, compilez en HTML statique rapide avec des îlots React interactifs.
heading: Prise en main
menu: docs
title: Introduction
weight: 10
---

# aardvark

**aardvark** est un générateur de site statique axé sur la documentation. Vous
rédigez en Markdown et compilez en HTML statique. L'interface interactive est
livrée sous forme d'**îlots** : aardvark émet le HTML, et Mantine ainsi que vos
propres composants React sont rendus dans le navigateur depuis un unique
runtime regroupé.

Ce site même est construit avec aardvark.

## Pourquoi aardvark

- **Markdown en entrée, HTML en sortie** — des URL propres, une table des
  matières et un thème par défaut soigné.
- **Vrai templating Python** — la logique vit dans des balises
  `{% raw %}{% %}{% endraw %}` et c'est du véritable Python, avec vos données
  structurées exposées via `data.<fichier>.<propriété>`.
- **Tous les composants Mantine** — intégrez n'importe quel composant Mantine
  (et vos propres extraits React) directement depuis le Markdown ; ils
  sont rendus en îlots.
- **Tout inclus** — recherche intégrée ⌘K, assistant « Ask AI » intégré, Google Analytics avec
  événements de notation de page, pages de référence OpenAPI « essayez
  maintenant », et génération automatique de `sitemap.xml` + `llms.txt`.
- **IA optionnelle à la compilation** — une fois activée, générez le
  frontmatter, des exemples de réponses d'API et un plan de création de
  compétences à partir de votre documentation.
- **Livré en un seul binaire** — compilez l'outil en un exécutable unique avec
  Nuitka. Node n'est requis qu'au moment de la compilation pour regrouper les
  îlots.

## Comment tout s'assemble

1. Vous écrivez du Markdown dans `content/`, des données structurées dans
   `data/`, et éventuellement des composants React personnalisés dans
   `snippets/`.
2. `vark build` exécute le templating Python `{% raw %}{% %}{% endraw %}`, rend le
   Markdown en HTML, rassemble chaque appel `{% raw %}{% component(...) %}{% endraw %}`
   en points de montage d'îlots, et regroupe les composants Mantine/extraits
   référencés avec esbuild.
3. La sortie dans `build/` est du HTML statique simple + un seul paquet JS/CSS,
   prêt à être hébergé n'importe où.

## Étapes suivantes

- [Installation](/fr/getting-started/installation/) — procurez-vous l'outil.
- [Démarrage rapide](/getting-started/quickstart/) — construisez votre premier site en une minute.
- [Galerie de composants](/components/) — des exemples de composants Mantine rendus en direct, appelables directement depuis Markdown.
