<template>
  <ConfirmAction
    header="Content Mapping"
    action-content="Learn more about Content Mapping"
    cancel-content="Continue"
    width="559"
    @onAccept="onLearnMore"
    @onCancel="onContinue"
  >
    <p>
      The <strong>Content Mapping</strong> feature for this project is ON. This
      means that elements from your print edition, like text and photos, will
      automatically map to your digital edition. There are two types of content
      mapping: (1) <strong>Layout Mapping</strong> which is active when you're
      working with pre-designed system layouts, and (2)
      <strong>Content Mapping</strong> which is active when you are working from
      a blank a page/spread.
    </p>
    <p>
      To turn the Content Mapping feature off and/or adjust your Content Mapping
      settings, click the “Mapping” icon in the tool bar.
    </p>
    <p>
      To learn more about Content Mapping, click the “Learn more” button below.
      To get started on your project, click “Continue.”
    </p>
  </ConfirmAction>
</template>

<script src="./script.js" />
