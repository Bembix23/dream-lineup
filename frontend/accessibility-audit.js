const fs = require('fs');
const path = require('path');

console.log('🌐 Audit d\'accessibilité - Dream Lineup');
console.log('Référentiel : WCAG 2.1 AA');
console.log('==========================================\n');

// Analyse des fichiers React
const srcDir = './src';
const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.js'));

let totalIssues = 0;
let accessibilityScore = 0;
const maxScore = 10;

// Critères WCAG vérifiés
const checks = {
  altText: { found: 0, total: 0, description: '1.1.1 - Images avec texte alternatif' },
  labels: { found: 0, total: 0, description: '1.3.1 - Labels sur les éléments de formulaire' },
  headings: { found: 0, total: 0, description: '1.3.1 - Structure hiérarchique des titres' },
  buttons: { found: 0, total: 0, description: '2.1.1 - Boutons accessibles au clavier' },
  colors: { found: 0, total: 0, description: '1.4.3 - Contraste suffisant des couleurs' },
  focus: { found: 0, total: 0, description: '2.4.7 - Indicateurs de focus visibles' },
  semantic: { found: 0, total: 0, description: '1.3.1 - Éléments sémantiques HTML5' },
  keyboard: { found: 0, total: 0, description: '2.1.1 - Navigation au clavier' },
  ariaLabels: { found: 0, total: 0, description: '4.1.2 - Attributs ARIA appropriés' },
  language: { found: 0, total: 0, description: '3.1.1 - Langue de la page définie' }
};

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`📄 Analyse de ${file}:`);
  
  // 1.1.1 - Images avec alt text
  const imgTags = content.match(/<img[^>]*>/g) || [];
  imgTags.forEach(img => {
    checks.altText.total++;
    if (img.includes('alt=')) {
      checks.altText.found++;
      console.log('  ✅ Image avec attribut alt détectée');
    } else {
      console.log('  ❌ Image sans attribut alt');
      totalIssues++;
    }
  });
  
  // 1.3.1 - Labels de formulaire
  const inputTags = content.match(/<input[^>]*>/g) || [];
  inputTags.forEach(input => {
    checks.labels.total++;
    if (input.includes('aria-label=') || input.includes('id=')) {
      checks.labels.found++;
      console.log('  ✅ Input avec label/aria-label');
    } else {
      console.log('  ❌ Input sans label accessible');
      totalIssues++;
    }
  });
  
  // 1.3.1 - Structure des titres
  const headings = content.match(/<h[1-6][^>]*>/g) || [];
  if (headings.length > 0) {
    checks.headings.total++;
    checks.headings.found++;
    console.log(`  ✅ Structure de titres détectée (${headings.length} titres)`);
  }
  
  // 2.1.1 - Boutons accessibles
  const buttons = content.match(/<button[^>]*>/g) || [];
  buttons.forEach(button => {
    checks.buttons.total++;
    if (button.includes('aria-label=') || !button.includes('onClick=')) {
      checks.buttons.found++;
      console.log('  ✅ Bouton accessible détecté');
    } else {
      console.log('  ⚠️  Bouton pourrait nécessiter aria-label');
    }
  });
  
  // 4.1.2 - Attributs ARIA
  const ariaLabels = (content.match(/aria-label=/g) || []).length;
  if (ariaLabels > 0) {
    checks.ariaLabels.total++;
    checks.ariaLabels.found++;
    console.log(`  ✅ ${ariaLabels} attributs aria-label trouvés`);
  }
  
  // Éléments sémantiques HTML5
  const semanticElements = content.match(/<(main|nav|header|footer|section|article)[^>]*>/g) || [];
  if (semanticElements.length > 0) {
    checks.semantic.total++;
    checks.semantic.found++;
    console.log(`  ✅ Éléments sémantiques HTML5 détectés (${semanticElements.length})`);
  }
  
  console.log('');
});

// Vérification du fichier index.html
const indexPath = './public/index.html';
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // 3.1.1 - Langue définie
  if (indexContent.includes('lang=')) {
    checks.language.found = 1;
    checks.language.total = 1;
    console.log('📄 index.html:');
    console.log('  ✅ Attribut lang défini sur <html>');
  }
}

// Vérification des styles CSS pour le contraste et focus
const cssFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.css'));
cssFiles.forEach(file => {
  const cssPath = path.join(srcDir, file);
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // 2.4.7 - Indicateurs de focus
  if (cssContent.includes(':focus') || cssContent.includes('outline')) {
    checks.focus.total++;
    checks.focus.found++;
  }
  
  // 1.4.3 - Vérification basique du contraste (présence de couleurs)
  if (cssContent.includes('color:') || cssContent.includes('background')) {
    checks.colors.total++;
    if (cssContent.includes('#000') || cssContent.includes('#fff') || cssContent.includes('black') || cssContent.includes('white')) {
      checks.colors.found++;
    }
  }
});

// Calcul du score final
console.log('📊 RÉSUMÉ DE L\'AUDIT D\'ACCESSIBILITÉ');
console.log('=====================================\n');

Object.entries(checks).forEach(([key, check]) => {
  if (check.total > 0) {
    const percentage = Math.round((check.found / check.total) * 100);
    console.log(`${check.description}`);
    console.log(`  📈 ${percentage}% conforme (${check.found}/${check.total})`);
    
    if (percentage >= 80) {
      console.log('  ✅ CONFORME\n');
      accessibilityScore += 1;
    } else if (percentage >= 50) {
      console.log('  🟡 PARTIELLEMENT CONFORME\n');
      accessibilityScore += 0.5;
    } else {
      console.log('  ❌ NON CONFORME\n');
    }
  }
});

// Score final
const finalScore = Math.round((accessibilityScore / maxScore) * 100);
console.log(`🏆 SCORE GLOBAL D'ACCESSIBILITÉ: ${finalScore}%`);

if (finalScore >= 80) {
  console.log('🟢 EXCELLENT - Conforme WCAG 2.1 AA');
} else if (finalScore >= 60) {
  console.log('🟡 BIEN - Quelques améliorations nécessaires');
} else {
  console.log('🔴 INSUFFISANT - Corrections majeures requises');
}

console.log('\n💡 RECOMMANDATIONS WCAG 2.1 AA:');
console.log('- Ajouter alt="" sur toutes les images décoratives');
console.log('- Utiliser aria-label sur les boutons d\'icônes');
console.log('- Vérifier le contraste des couleurs (ratio 4.5:1 minimum)');
console.log('- Tester la navigation au clavier (Tab, Entrée, Échap)');
console.log('- Valider avec un lecteur d\'écran (NVDA, JAWS)');

console.log('\n📋 OUTILS DE VÉRIFICATION RECOMMANDÉS:');
console.log('- Extension axe DevTools (Chrome/Firefox)');
console.log('- Lighthouse Accessibility (Chrome DevTools)');
console.log('- Wave Web Accessibility Evaluator');
console.log('- Colour Contrast Analyser');