<template>
  <Modal
    title="Content Mapping: Overview"
    width="797"
    :is-close-out-side="false"
  >
    <div class="content-mapping-overview">
      <div class="content-mapping-overview-title">
        <div>
          <p>
            <strong>Content Mapping</strong> is a feature that automatically
            maps elements from your print edition to your digital edition OR
            from your digital edition to your print edition. You can set the
            direction in your Content Mapping settings. The reason that the
            mapping only goes in one direction is to protect the layout of your
            primary format. For example, if print is your primary format,
            adjustments made to your digital edition
            <span class="bold-italic">could</span> have unintended consequences
            to your print edition. With the mapping flow only going one
            direction, this ensures that all the page/screen designs in your
            primary format remain protected.
          </p>
          <p>
            There are two types of Content Mapping:
          </p>
          <p>
            1. <strong>Layout Mapping</strong> is the mapping that occurs when
            you are working from a pre-designed system layout. Image and text
            boxes on the print side have corresponding image and text boxes on
            the digital side (and vice versa). For example, when a photo is
            placed on the print side, that same photo will appear in the
            corresponding image box on the digital side.
            <em
              >NOTE: only text and image updates are mapped. Changes to style,
              size, position, etc. are not mapped. Also, any custom elements,
              like shapes or clip art, that are added on top of a system layout
              are not mapped.</em
            >
          </p>
          <p>
            2. <strong>Custom Mapping</strong> is the mapping that occurs when
            you are working from a blank canvas and are adding elements piece by
            piece. Custom mapping uses quadrants and location approximation to
            place elements from your primary format on to your secondary format.
            <em
              >NOTE: Unlike with Layout Mapping, changes to style, size,
              position, etc. will be mapped in Custom Mapping. Also, Custom
              Mapping can be paused and restarted if desired. Custom mapping
              only applies to elements added when mapping is turned on.</em
            >
          </p>

          <p>
            A general rule for both Layout and Custom Mapping is that
            page/screen elements will remain mapped (connected) while edits are
            made in the primary format. Once edits are made to an element in the
            secondary format, the mapping connection is broken. This allows you
            to adjust the secondary format without concern that your design in
            the primary format will be altered.
          </p>
        </div>
      </div>
      <div class="container-btn">
        <PpButton is-active @click="onCancel">
          Got it!
        </PpButton>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped></style>
