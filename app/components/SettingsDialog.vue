<template>
  <div>
    <!-- PC は中央のカード、スマホは全画面 -->
    <v-dialog
      v-model="dialog"
      :fullscreen="fullscreen"
      :max-width="fullscreen ? undefined : 480"
      :transition="fullscreen ? 'dialog-bottom-transition' : undefined"
      class="settintgs-dialog"
    >
      <v-card class="settings">
        <div class="settings__header">
          <h2 class="settings__title">
            {{ $t("setting_title") }}
          </h2>
          <v-btn
            icon="$close"
            variant="text"
            :aria-label="$t('close')"
            @click="dialog = false"
          />
        </div>

        <section class="settings__section">
          <div class="settings__row">
            <span class="settings__label">{{ $t("setting_rotation_time") }}</span>
          </div>
          <!-- 値は ms のまま（Wheel.vue が localStorage から読む）。読み上げは aria-valuetext の秒で -->
          <!-- ダークの primary は背景との差が小さく、バーの残りが見えなくなるので、残りは on-surface（薄く）にする -->
          <v-slider
            :model-value="rotationTimeValue"
            :min="0"
            :max="10000"
            :step="500"
            color="primary"
            track-color="on-surface"
            hide-details
            class="settings__slider"
            :aria-label="$t('setting_rotation_time')"
            :aria-valuetext="rotationTimeText"
            @update:model-value="setRotationTime"
            @end="$audio.click()"
          />
          <div class="settings__ends">
            <span>{{ $t("setting_rotation_instant") }}</span>
            <span>{{ $t("setting_rotation_long") }}</span>
          </div>
        </section>

        <v-divider />

        <section class="settings__section">
          <div class="settings__row">
            <span class="settings__label">{{ $t("sound") }}</span>
            <v-switch
              :model-value="audio"
              inset
              color="primary"
              hide-details
              role="switch"
              :aria-label="$t('sound')"
              @update:model-value="setAudio"
            />
          </div>
          <!-- オフのときは選んでも鳴らない（試聴もできない）ので、押せなくする -->
          <div
            class="settings__caption"
            :class="{ 'settings__caption--disabled': !audio }"
          >
            {{ $t("setting_sound_type") }}
          </div>
          <!-- v-btn-toggle は選んだボタンに白い overlay を重ねて、文字が読みにくくなるので、色は自分で付ける -->
          <v-btn-group
            divided
            border
            class="settings__sound-types"
          >
            <v-btn
              v-for="item in audioResultTypes"
              :key="item"
              :color="item == audioResultType ? 'primary' : undefined"
              :disabled="!audio"
              :aria-pressed="item == audioResultType"
              @click="setAudioResult(item)"
            >
              {{ item }}
            </v-btn>
            <v-btn
              :color="99 == audioResultType ? 'primary' : undefined"
              :disabled="!audio"
              :aria-pressed="99 == audioResultType"
              @click="setAudioResult(99)"
            >
              <v-icon
                icon="$random"
                start
              />
              {{ $t("setting_random") }}
            </v-btn>
          </v-btn-group>
        </section>

        <v-divider />

        <section class="settings__section">
          <div class="settings__row">
            <!-- 見出しは文字ではなく、今のテーマのアイコン。読み上げはスイッチの aria-label（ダークモード） -->
            <span class="settings__label">
              <v-icon :icon="$colorMode.value == 'dark' ? '$themeDark' : '$themeLight'" />
            </span>
            <theme-switch />
          </div>
        </section>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { parseNumberSetting } from "~/utils/settings";

export default {
  data(): {
    dialog: boolean;
    rotationTimeValue: number;
    audio: boolean;
    audioResultType: number;
    audioResultTypes: number[];
  } {
    return {
      dialog: false,
      rotationTimeValue: 0,
      audio: false,
      audioResultType: 1,
      audioResultTypes: [1, 2, 3],
    };
  },
  computed: {
    // ダイアログの中身はサーバーで描かないので、画面の幅を見てよい
    fullscreen(): boolean {
      return this.$vuetify.display.xs;
    },
    rotationTimeText(): string {
      if (this.rotationTimeValue === 0) return this.$t("setting_rotation_instant");
      return this.$t("setting_seconds", { n: this.rotationTimeValue / 1000 });
    },
  },
  mounted() {
    this.rotationTimeValue = parseNumberSetting(localStorage.getItem("rotationTime"), 8000);
    localStorage.setItem("rotationTime", String(this.rotationTimeValue));

    this.audio = localStorage.getItem("audio") == "true";

    this.audioResultType = parseNumberSetting(localStorage.getItem("audioResultType"), 1);
    localStorage.setItem("audioResultType", String(this.audioResultType));
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click();
    },
    // ドラッグ中も保存する（キーボードの操作は end が来ない）。クリック音は離したときに鳴らす
    setRotationTime(num: number) {
      this.rotationTimeValue = num;
      localStorage.setItem("rotationTime", `${num}`);
    },
    setAudio(value: boolean | null) {
      this.audio = !!value;
      localStorage.setItem("audio", `${this.audio}`);
      this.$audio.click();
    },
    setAudioResult(num: number) {
      this.audioResultType = num;
      localStorage.setItem("audioResultType", `${num}`);
      this.$audio.result();
    },
  },
};
</script>

<style lang="scss" scoped>
// Vuetify のダイアログは角丸が 4px。全画面のときは角を付けない
.v-dialog:not(.v-dialog--fullscreen) > .v-overlay__content > .settings {
  border-radius: 16px;
}

.settings__header {
  display: flex;
  align-items: center;
  padding: 12px 12px 4px 24px;
}

.settings__title {
  flex: 1 1 auto;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
}

.settings__section {
  padding: 16px 24px 20px;
}

.settings__row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 40px;

  // v-switch（v-input）は横に伸びるので、右端に寄せる
  :deep(.v-input) {
    flex: 0 0 auto;
  }

  // Vuetify はスイッチのバーをオンでも 0.6 の不透明度で描くので、薄くて押せないように見える。オンのときは塗りつぶす
  :deep(.v-selection-control--dirty .v-switch__track) {
    opacity: 1;
  }
}

.settings__label {
  flex: 1 1 auto;
  font-weight: 500;
}

// v-slider は左右に 8px の余白を持つ。外して、バーの両端を見出しと「一瞬」「長い」の端にそろえる
.settings__section .settings__slider {
  margin: 4px 0 0;
}

.settings__ends {
  display: flex;
  justify-content: space-between;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.75rem;
}

.settings__caption {
  margin: 8px 0 12px;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
}

.settings__caption--disabled {
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

.settings__sound-types {
  display: flex;
  width: 100%;
  border-radius: 10px;

  // 等分だと、スマホでは「ランダム」（Random）がアイコンと一緒に入らない
  .v-btn {
    flex: 1 1 auto;
    letter-spacing: normal;
    text-transform: none;
  }
}
</style>
