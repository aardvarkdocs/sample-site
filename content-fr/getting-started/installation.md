---
description: Installez aardvark avec uv, ou compilez un binaire autonome. Node est requis
  à la compilation pour regrouper les îlots Mantine.
menu: docs
title: Installation
weight: 11
---

# Installation

## Prérequis

| Outil | Version | Pourquoi |
| --- | --- | --- |
| [uv](https://docs.astral.sh/uv/) | ≥ 0.11 | Environnement Python + lanceur (installe Python 3.12 pour vous) |
| Node.js + npm | Node ≥ 18 | Regroupe les îlots Mantine/React à la compilation |

Node n'est nécessaire que pour compiler le JS des îlots. Vous pouvez vous en
passer avec `vark build --no-bundle` (les composants s'affichent alors comme des
espaces réservés inertes).

## Depuis les sources (recommandé pour l'instant)

```bash
git clone <votre fork de ce dépôt> aardvark
cd aardvark
uv sync
```

La CLI est ensuite disponible via `uv run vark` :

```bash
uv run vark --help
```

## En binaire autonome

Compilez l'outil en un exécutable unique avec Nuitka :

```bash
scripts/build-release.sh dist    # -> dist/vark (fichier unique)
./dist/vark --version
```

Pour itérer rapidement en local, `scripts/build-binary.sh` compile bien plus
vite (sans `--onefile` ni LTO) mais produit un dossier : `dist/aardvark.dist/vark-dev`.

Le binaire embarque le thème par défaut et le runtime des îlots. Node reste
requis sur la machine de compilation pour regrouper les îlots. Voir
[Déploiement](/deployment/) pour les détails.

## Optionnel : IA à la compilation

Les fonctionnalités propulsées par OpenRouter sont un extra optionnel —
choisissez n'importe quel modèle :

```bash
uv sync --extra ai
export OPENROUTER_API_KEY=sk-or-...
```

Voir [IA à la compilation](/ai-features/).
