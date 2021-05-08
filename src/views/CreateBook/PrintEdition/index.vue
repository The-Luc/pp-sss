<template lang="">
<div class="row print-main">
    <div class="col-12 print-editor">
        <Header nameEditor="print editor"/>
        <ToolBar />
    </div>
    <FeedbackBar />    
		<SidebarSection />
    <PageEdition />
</div>
</template>

<script>
import './index.scss';
import ToolBar from './ToolBar';
import Header from './Header';
import FeedbackBar from './FeedbackBar';
import PageEdition from './PageEdition';
import SidebarSection from './SidebarSection';
export default {
    components: {
        ToolBar,
        Header,
        FeedbackBar,
        PageEdition,
        SidebarSection
    }
};
</script>

<style lang=""></style>
