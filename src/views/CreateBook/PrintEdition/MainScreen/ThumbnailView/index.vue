<template>
    <div class="col-3 thumbnail-view-item">
        <div class="thumbnail-view-container">
          <div class="thumbnail-view-header">
            <div>
              <div class="header-color"></div>
              <div class="header-name">Cover</div>
            </div>
            <div class="header-more">
              <v-icon class="icon-more">more_horiz</v-icon>
              <div class="header-more-container">
                <div class="header-more-item">
                  <div class="item-title">Status:</div>
                  <div class="item-value">In Process</div>
                </div>
                <div class="header-more-item">
                  <div class="item-title">Due Date:</div>
                  <div class="item-value">05/21/21</div>
                </div>
                <div class="header-more-item">
                  <div class="item-title">Assigned To:</div>
                  <div class="item-value">Unassigned</div>
                </div>
                <div class="header-more-item">
                  <div class="item-title">Last Edit:</div>
                  <div class="item-value">
                    10:28am on Mar 03, 2021 John Smith
                  </div>
                </div>
                <div class="header-more-item">
                  <div class="header-more-screen-notes">
                    <v-icon class="icon-post">post_add</v-icon>
                    <span> Screen Notes </span>
                  </div>
                </div>
                <div class="header-more-item">
                  <div class="header-more-screen-preview">
                    <div>Preview</div>
                    <div>PDF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="thumbnail-view-thumbnail">
            <div class="thumbnail-edit">
              <v-icon class="icon-edit">edit</v-icon>
            </div>
            <div class="thumbnail-left"></div>
            <div class="thumbnail-right"></div>
          </div>
          <div class="thumbnail-view-number-page">
            <div class="number-page-left">Back Cover</div>
            <div class="number-page-link">
              <v-icon class="icon-link">link</v-icon>
            </div>
            <div class="number-page-right">Font Cover</div>
          </div>
        </div>
      </div>
</template>
<style lang="scss" scoped src="./style.scss" />