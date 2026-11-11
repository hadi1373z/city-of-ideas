/* Run before the existing arrow's pointer handler sets its held movement key. */
(()=>{const pad=document.querySelector('.touch-pad');pad?.addEventListener('pointerdown',event=>{if(!event.target.closest('[data-move]'))return;for(const dialog of document.querySelectorAll('dialog[open][data-workbench="true"]'))dialog.close('movement');},true);})();
