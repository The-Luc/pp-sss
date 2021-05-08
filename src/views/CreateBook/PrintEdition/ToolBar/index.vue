<template lang="">
  <div class="row print-editor-tool">
    <div class="tool-left">
      <div class="item-tool">
        <ToolButton iconName="photo_filter" title="Themes"/>
        <ToolButton iconName="import_contacts" title="Layouts"/>
        <ToolButton iconName="texture" title="Backgrounds"/>
        <ToolButton iconName="local_florist" title="Clip Art"/>
      </div>
      <div class="item-tool">
        <ToolButton iconName="star" title="Shapes"/>
        <ToolButton iconName="text_format" title="Text"/>
        <ToolButton iconName="photo_size_select_large" title="Image Box"/>
        <ToolButton iconName="collections" title="Photos"/>
        <ToolButton iconName="portrait" title="Portraits"/>
      </div>
      <div class="item-tool">
        <ToolButton iconName="grid_on" title="Grid"/>
        <ToolButton iconName="undo" title="Undo"/>
        <ToolButton iconName="redo" title="Redo"/>
        <ToolButton iconName="delete" title="Delete"/>
      </div>
      <div class="item-tool">
        <ToolButton iconName="smart_button" title="Actions"/>
        <ToolButton iconName="note_add" title="Page Notes"/>
      </div>
    </div>
    <div class="tool-right">
      <div class="item-tool">
        <ToolButton iconName="list_alt" title="Page Info"/>
        <ToolButton iconName="wysiwyg" title="Properties"/>
      </div>
    </div>
  </div>
</template>

<script>
import ToolButton from '@/components/ToolButton'
import './index.scss';
export default {
  components: {
    ToolButton
  },
  methods: {
    themes(){
      console.log(0);
    }
  }
};
</script>

<style lang=""></style>
