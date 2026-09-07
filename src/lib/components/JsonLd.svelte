<script lang="ts">
	// מזריק סכמת schema.org (JSON-LD) ל-<head>. ה-`<` מוחלף ב-< כדי
	// שתוכן הסכמה לא יוכל לסגור את תג ה-script בטעות.
	let { schema }: { schema: object | object[] } = $props();
	const json = $derived(JSON.stringify(schema).replace(/</g, '\\u003c'));
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${json}</` + 'script>'}
</svelte:head>
