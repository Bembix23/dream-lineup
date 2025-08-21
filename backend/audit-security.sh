#!/bin/bash

echo "🔍 Audit de sécurité RAPIDE - Dream Lineup"
echo "========================================="
echo ""

echo "📦 1. Vulnérabilités npm..."
if npm audit --audit-level=moderate >/dev/null 2>&1; then
    echo "✅ Aucune vulnérabilité détectée"
    npm_score=1
else
    echo "⚠️  Vulnérabilités trouvées"
    npm_score=0
fi

echo "📅 2. Packages obsolètes..."
outdated_count=$(npm outdated 2>/dev/null | wc -l)
if [ "$outdated_count" -le 1 ]; then
    echo "✅ Packages à jour"
    outdated_score=1
else
    echo "⚠️  $outdated_count packages obsolètes"
    outdated_score=0
fi

echo "🔒 3. Fichiers sensibles..."
sensitive_count=$(find . -name "*.key" -o -name "*.pem" -o -name "*secret*" 2>/dev/null | grep -v node_modules | wc -l)
if [ "$sensitive_count" -eq 0 ]; then
    echo "✅ Aucun fichier sensible détecté"
    files_score=1
else
    echo "⚠️  $sensitive_count fichiers sensibles trouvés"
    files_score=0
fi

echo "🔍 4. Vérification .env..."
if ! git ls-files 2>/dev/null | grep -q "\.env$"; then
    echo "✅ .env protégé (pas dans Git)"
    env_score=1
else
    echo "⚠️  .env trouvé dans Git (risque)"
    env_score=0
fi

echo "🕵️  5. Secrets hardcodés..."
secrets_count=$(grep -r -i --include="*.ts" --include="*.js" --exclude-dir=node_modules \
   -E "(api[_-]?key|secret|password|token).*(=|:).*(\"|\')[^\"\']{20,}" . 2>/dev/null | wc -l)
if [ "$secrets_count" -eq 0 ]; then
    echo "✅ Aucun secret hardcodé"
    secrets_score=1
else
    echo "⚠️  $secrets_count secrets potentiels"
    secrets_score=0
fi

total_score=$((npm_score + outdated_score + files_score + env_score + secrets_score))
echo ""
echo "📊 RÉSUMÉ AUDIT"
echo "=============="
echo "🏆 SCORE: $total_score/5"

if [ $total_score -eq 5 ]; then
    echo "🛡️  EXCELLENT: Sécurité parfaite !"
elif [ $total_score -ge 4 ]; then
    echo "🟡 BIEN: Sécurité correcte"
elif [ $total_score -ge 3 ]; then
    echo "🟠 MOYEN: Améliorations nécessaires"
else
    echo "🔴 FAIBLE: Problèmes de sécurité"
fi

echo ""
echo "✅ Audit rapide terminé en $(date +%S) secondes"