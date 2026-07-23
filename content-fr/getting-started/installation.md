---
description: Installez aardvark via Homebrew ou un binaire de release précompilé. Node est
  requis à la compilation pour regrouper les îlots Mantine.
menu: docs
title: Installation
weight: 11
---

# Installation

## Prérequis

| Outil | Version | Pourquoi |
| --- | --- | --- |
| Node.js + npm | Node ≥ 20.19 | Regroupe les îlots Mantine/React à la compilation |

Le binaire `vark` est autonome — il embarque son propre runtime Python, il n'y a
donc rien d'autre à installer. Node n'est nécessaire que pour compiler le JS des
îlots. Vous pouvez vous en passer avec `vark build --no-bundle` (les composants
s'affichent alors comme des espaces réservés inertes).

## Installer avec Homebrew (macOS)

Le moyen le plus rapide sur un Mac — installe un binaire autonome, aucun Python
requis :

```bash
brew tap aardvarkdocs/tap
brew install aardvark
vark --version
```

Le paquet Homebrew s'appelle `aardvark` (comme le projet), mais il installe la CLI
sous le nom **`vark`** — plus court à taper. (`aardvark` est aussi installé comme
alias, les deux noms fonctionnent donc.) Mettez à jour plus tard avec
`brew update && brew upgrade aardvark`.

## Windows et Linux

Téléchargez le binaire précompilé depuis la
[dernière release](https://github.com/aardvarkdocs/homebrew-tap/releases/latest)
(`aardvark-<version>-windows-x86_64.zip` ou les tarballs
`aardvark-<version>-linux-x86_64.tar.gz` / `…-linux-aarch64.tar.gz`), placez `vark`
sur votre `PATH`, puis lancez `vark --version`.

Le binaire embarque le thème par défaut et le runtime des îlots, il fonctionne
donc immédiatement. Node n'est nécessaire qu'à la *compilation du site* pour les
îlots interactifs — voir [Déploiement](/deployment/) pour les détails.

## Fonctionnalités IA

Les fonctionnalités IA d'aardvark sont intégrées au binaire — rien d'autre à
installer. Activez-les dans `aardvark.config.yaml` (le bloc `ai:`) et fournissez
une clé. Voir [Fonctionnalités IA](/ai/) pour la vue d'ensemble,
[IA à la compilation](/ai-features/) pour les options d'enrichissement à la
compilation, et [Passerelle cloud](/ai-gateway/) pour l'assistant de lecture
hébergé.
