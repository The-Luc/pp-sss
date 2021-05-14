<template>
  <div id="manager-summary" class="manager-summary">
    <div class="scroll-container">
      <div class="row">
        <div class="col-12 summary-title">
          <img
            src="@/assets/icons/double-arrow-right.svg"
            @click="toogleSummary"
          />
          <span class="text-700">PROGRAM SUMMARY</span>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="row summary-detail">
            <div class="col-12">
              <p class="text-700 group-title">Important Dates</p>

              <p class="group-detail">
                <span class="info-name">Requested Delivery Date:</span>
                <br />
                <span class="info-detail">06/04/21</span>
              </p>

              <p class="group-detail">
                <span class="info-name">File Release Due Date:</span>
                <br />
                <span class="info-detail">05/21/21</span>
              </p>

              <p class="group-detail">
                <span class="info-name">Countdown:</span>
                <br />
                <span class="info-detail countdown">170 days remaining</span>
              </p>
            </div>
          </div>

          <div class="row summary-detail">
            <div class="col-12">
              <p class="text-700 group-title">Specification</p>

              <p class="group-detail">
                <span class="info-name">Cover Option:</span>
                <br />
                <span class="info-detail">Hardcover</span>
              </p>

              <p class="group-detail">
                <span class="info-name">Number of Pages (maximum):</span>
                <br />
                <span class="info-detail">48</span>
              </p>

              <p class="group-detail">
                <span class="info-name">Estimated Quantity:</span>
                <br />
                <span class="info-detail">50 - 100</span>
              </p>

              <p class="group-detail">
                <span class="info-name">Delivery Option:</span>
                <br />
                <span class="info-detail">Bulk Ship To School</span>
              </p>
            </div>
          </div>

          <div class="row summary-detail">
            <div class="col-12">
              <p class="text-700 group-title">Sales</p>

              <p class="group-detail">
                <span class="info-name">Books Sold:</span>
                <br />
                <span class="info-detail">0</span>
              </p>

              <p class="group-detail">
                <span class="info-name">Fundraising $ Earned:</span>
                <br />
                <span class="info-detail">$0.00</span>
              </p>
            </div>
          </div>

          <div class="row summary-detail">
            <div class="col-12">
              <p class="text-700 group-title">Progress</p>

              <p class="group-detail">
                <img src="@/assets/image/chart.png" alt="chart" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
