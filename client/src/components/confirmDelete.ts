export const confirmDelete = (message: string): Promise<boolean> => new Promise(resolve => {
    const previousFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = 'm-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-gray-200 bg-white p-0 shadow-lg backdrop:bg-black/40';
    dialog.setAttribute('aria-labelledby', 'delete-dialog-title');
    dialog.setAttribute('aria-describedby', 'delete-dialog-description');

    const panel = document.createElement('div');
    panel.className = 'p-6';
    const title = document.createElement('h2');
    title.id = 'delete-dialog-title';
    title.className = 'text-xl font-semibold text-slate-900';
    title.textContent = 'Confirm deletion';
    const description = document.createElement('p');
    description.id = 'delete-dialog-description';
    description.className = 'mt-3 break-words text-sm leading-6 text-slate-600';
    description.textContent = `${message} This action cannot be undone.`;
    const actions = document.createElement('div');
    actions.className = 'mt-6 flex justify-end gap-3';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500';
    cancel.textContent = 'Cancel';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600';
    remove.textContent = 'Delete';
    const finish = (confirmed: boolean) => {
        dialog.close();
        dialog.remove();
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        resolve(confirmed);
    };
    cancel.addEventListener('click', () => finish(false));
    remove.addEventListener('click', () => finish(true));
    dialog.addEventListener('cancel', event => {
        event.preventDefault();
        finish(false);
    });
    actions.append(cancel, remove);
    panel.append(title, description, actions);
    dialog.append(panel);
    document.body.append(dialog);
    dialog.showModal();
    cancel.focus();
});
