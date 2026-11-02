const grid = document.getElementById('recipe-grid');
const search = document.getElementById('recipe-search');
const empty = document.getElementById('empty-state');
let activeCategory = 'All';
function photoPath(recipe) { return 'images/' + recipe.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.jpg'; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function renderRecipes() {
  const term = (search.value || '').trim().toLowerCase();
  const filtered = recipes.filter(recipe => {
    const categoryMatch = activeCategory === 'All' || recipe.category === activeCategory;
    const searchable = [recipe.title, recipe.category, recipe.description, ...(recipe.ingredients||[]), ...(recipe.method||[])].join(' ').toLowerCase();
    return categoryMatch && searchable.includes(term);
  });
  grid.innerHTML = filtered.map((recipe, index) => `<article class="recipe-card" tabindex="0" role="button" aria-label="Open ${escapeHtml(recipe.title)} recipe" data-recipe-index="${recipes.indexOf(recipe)}">
    <div class="recipe-photo"><img src="${escapeHtml(photoPath(recipe))}" onerror="this.onerror=null;this.src='${escapeHtml(recipe.image || 'images/recipe-placeholders/placeholder.svg')}'" alt="${escapeHtml(recipe.title)}"></div>
    <div class="recipe-info"><span class="recipe-category">${escapeHtml(recipe.category)}</span><h3>${escapeHtml(recipe.title)}</h3><p>${escapeHtml(recipe.description)}</p><span class="recipe-open">View recipe ↗</span></div></article>`).join('');
  empty.hidden = filtered.length > 0;
}
function openRecipe(recipe) {
  const old = document.getElementById('recipe-dialog'); if (old) old.remove();
  const dialog = document.createElement('dialog'); dialog.id='recipe-dialog'; dialog.className='recipe-dialog';
  dialog.innerHTML = `<button class="dialog-close" aria-label="Close recipe">×</button><span class="recipe-category">${escapeHtml(recipe.category)}</span><h2>${escapeHtml(recipe.title)}</h2><img class="dialog-recipe-image" src="${escapeHtml(photoPath(recipe))}" onerror="this.onerror=null;this.src='${escapeHtml(recipe.image || 'images/recipe-placeholders/placeholder.svg')}'" alt="${escapeHtml(recipe.title)}"><p class="dialog-description">${escapeHtml(recipe.description)}</p><div class="dialog-columns"><section><h3>Ingredients</h3><ul>${(recipe.ingredients||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section><section><h3>Method</h3><ol>${(recipe.method||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol></section></div>${recipe.note?`<p class="recipe-note">${escapeHtml(recipe.note)}</p>`:''}<p class="dialog-foot">A recipe from Betty’s Bites</p>`;
  document.body.appendChild(dialog); dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close()); dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()}); dialog.addEventListener('close',()=>dialog.remove()); dialog.showModal();
}
grid.addEventListener('click', e=>{const card=e.target.closest('[data-recipe-index]'); if(card)openRecipe(recipes[Number(card.dataset.recipeIndex)]);});
grid.addEventListener('keydown', e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-recipe-index]')){e.preventDefault();openRecipe(recipes[Number(e.target.dataset.recipeIndex)]);}});
search.addEventListener('input', renderRecipes);
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip.dataset.category === activeCategory));
  if(button.classList.contains('category-card')) document.getElementById('recipes').scrollIntoView({behavior:'smooth'});
  renderRecipes();
}));
const menuToggle=document.querySelector('.menu-toggle'); const nav=document.getElementById('main-nav');
menuToggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(isOpen));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));
renderRecipes();
