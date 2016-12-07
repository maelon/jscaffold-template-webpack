<template>
    <div>page-b</div>
</template>

<script>
    import servicea from 'services/a';
    import serviceb from 'services/b';

    export default {
        mounted() {
            console.log('pageb');
            servicea(serviceb('i am b!'));
        }
    };
</script>

<style>
</style>
