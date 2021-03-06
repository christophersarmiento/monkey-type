function updateSettingsPage() {
  let themesEl = $(".pageSettings .section.themes .buttons").empty();
  themesList.forEach((theme) => {
    themesEl.append(
      `<div class="theme button" theme='${theme.name}' style="color:${
        theme.textColor
      };background:${theme.bgColor}">${theme.name.replace(/_/g, " ")}</div>`
    );
  });

  let langEl = $(".pageSettings .section.languages .buttons").empty();
  Object.keys(words).forEach((language) => {
    if (language === "english_10k") return;
    langEl.append(
      `<div class="language button" language='${language}'>${language.replace(
        "_",
        " "
      )}</div>`
    );
    if (language === "english_expanded") {
      langEl.append(
        `<div class="language button" language='english_10k'>english 10k</div>`
      );
    }
  });

  let layoutEl = $(".pageSettings .section.layouts .buttons").empty();
  Object.keys(layouts).forEach((layout) => {
    layoutEl.append(
      `<div class="layout button" layout='${layout}'>${layout.replace(
        "_",
        " "
      )}</div>`
    );
  });

  let keymapEl = $(".pageSettings .section.keymapLayout .buttons").empty();
  Object.keys(layouts).forEach((layout) => {
    if (layout.toString() != "default") {
      keymapEl.append(
        `<div class="layout button" layout='${layout}'>${layout.replace(
          "_",
          " "
        )}</div>`
      );
    }
  });

  refreshTagsSettingsSection();

  setSettingsButton("smoothCaret", config.smoothCaret);
  setSettingsButton("quickTab", config.quickTab);
  setSettingsButton("liveWpm", config.showLiveWpm);
  setSettingsButton("timerBar", config.showTimerBar);
  setSettingsButton("keymap-toggle", config.keymap);
  setSettingsButton("keyTips", config.showKeyTips);
  setSettingsButton("freedomMode", config.freedomMode);
  setSettingsButton("blindMode", config.blindMode);
  setSettingsButton("quickEnd", config.quickEnd);
  setSettingsButton("flipTestColors", config.flipTestColors);
  setSettingsButton("discordDot", config.showDiscordDot);
  setSettingsButton("colorfulMode", config.colorfulMode);
  setSettingsButton("randomTheme", config.randomTheme);
  setSettingsButton("stopOnError", config.stopOnError);
  setSettingsButton("showAllLines", config.showAllLines);

  setActiveLayoutButton();
  setActiveThemeButton();
  setActiveLanguageButton();
  setActiveFontSizeButton();
  setActiveDifficultyButton();
  setActiveCaretStyleButton();
  setActiveTimerStyleButton();
  setActiveTimerColorButton();
  setActiveTimerOpacityButton();
  setActiveThemeTab();
  setCustomThemeInputs();
  setActiveConfidenceModeButton();

  setActiveKeymapModeButton();
  setActiveKeymapLayoutButton();

  updateDiscordSettingsSection();

  if (config.showKeyTips) {
    $(".pageSettings .tip").removeClass("hidden");
  } else {
    $(".pageSettings .tip").addClass("hidden");
  }
}

function showCustomThemeShare() {
  if ($("#customThemeShareWrapper").hasClass("hidden")) {
    let save = [];
    $.each(
      $(".pageSettings .section.customTheme [type='color']"),
      (index, element) => {
        save.push($(element).attr("value"));
      }
    );
    $("#customThemeShareWrapper input").val(JSON.stringify(save));
    $("#customThemeShareWrapper")
      .stop(true, true)
      .css("opacity", 0)
      .removeClass("hidden")
      .animate({ opacity: 1 }, 100, (e) => {
        $("#customThemeShare input").focus();
        $("#customThemeShare input").select();
        $("#customThemeShare input").focus();
      });
  }
}

function hideCustomThemeShare() {
  if (!$("#customThemeShareWrapper").hasClass("hidden")) {
    try {
      config.customThemeColors = JSON.parse(
        $("#customThemeShareWrapper input").val()
      );
    } catch (e) {
      showNotification(
        "Something went wrong. Reverting to default custom colors.",
        3000
      );
      config.customThemeColors = defaultConfig.customThemeColors;
    }
    setCustomThemeInputs();
    applyCustomThemeColors();
    $("#customThemeShareWrapper input").val("");
    $("#customThemeShareWrapper")
      .stop(true, true)
      .css("opacity", 1)
      .animate(
        {
          opacity: 0,
        },
        100,
        (e) => {
          $("#customThemeShareWrapper").addClass("hidden");
        }
      );
  }
}

$("#customThemeShareWrapper").click((e) => {
  if ($(e.target).attr("id") === "customThemeShareWrapper") {
    hideCustomThemeShare();
  }
});

$("#customThemeShare .button").click((e) => {
  hideCustomThemeShare();
});

$("#shareCustomThemeButton").click((e) => {
  showCustomThemeShare();
});

function refreshTagsSettingsSection() {
  if (firebase.auth().currentUser !== null && dbSnapshot !== null) {
    let tagsEl = $(".pageSettings .section.tags .tagsList").empty();
    dbSnapshot.tags.forEach((tag) => {
      if (tag.active === true) {
        tagsEl.append(`
            
                <div class="tag" id="${tag.id}">
                    <div class="active" active="true">
                        <i class="fas fa-check-square"></i>
                    </div>
                    <div class="title">${tag.name}</div>
                    <div class="editButton"><i class="fas fa-pen"></i></div>
                    <div class="removeButton"><i class="fas fa-trash"></i></div>
                </div>
            
            `);
      } else {
        tagsEl.append(`
            
                <div class="tag" id="${tag.id}">
                    <div class="active" active="false">
                        <i class="fas fa-square"></i>
                    </div>
                    <div class="title">${tag.name}</div>
                    <div class="editButton"><i class="fas fa-pen"></i></div>
                    <div class="removeButton"><i class="fas fa-trash"></i></div>
                </div>
            
            `);
      }
    });
    $(".pageSettings .section.tags").removeClass("hidden");
  } else {
    $(".pageSettings .section.tags").addClass("hidden");
  }
}

function setActiveThemeButton() {
  $(`.pageSettings .section.themes .theme`).removeClass("active");
  $(`.pageSettings .section.themes .theme[theme=${config.theme}]`).addClass(
    "active"
  );
}

function setActiveThemeTab() {
  config.customTheme === true
    ? $("[tab='custom']").click()
    : $("[tab='preset']").click();
}

function setCustomThemeInputs() {
  $("[type=color]").each((n, index) => {
    let currentColor =
      config.customThemeColors[colorVars.indexOf($(index).attr("id"))];
    $(index).val(currentColor);
    $(index).attr("value", currentColor);
    $(index).prev().text(currentColor);
  });
}

function setActiveKeymapModeButton() {
  $(`.pageSettings .section.keymapMode .button`).removeClass("active");
  $(
    `.pageSettings .section.keymapMode .button[keymapMode="${config.keymapMode}"]`
  ).addClass("active");
  if (config.keymapMode === "off") {
    $(".pageSettings .section.keymapLayout").addClass("hidden");
  } else {
    $(".pageSettings .section.keymapLayout").removeClass("hidden");
  }
}

function setActiveKeymapLayoutButton() {
  $(`.pageSettings .section.keymapLayout .layout`).removeClass("active");
  $(
    `.pageSettings .section.keymapLayout .layout[layout=${config.keymapLayout}]`
  ).addClass("active");
}

function setActiveLayoutButton() {
  $(`.pageSettings .section.layouts .layout`).removeClass("active");
  $(`.pageSettings .section.layouts .layout[layout=${config.layout}]`).addClass(
    "active"
  );
}

function setActiveFontSizeButton() {
  $(`.pageSettings .section.fontSize .buttons .button`).removeClass("active");
  $(
    `.pageSettings .section.fontSize .buttons .button[fontsize=` +
      config.fontSize +
      `]`
  ).addClass("active");
}

function setActiveDifficultyButton() {
  $(`.pageSettings .section.difficulty .buttons .button`).removeClass("active");
  $(
    `.pageSettings .section.difficulty .buttons .button[difficulty=` +
      config.difficulty +
      `]`
  ).addClass("active");
}

function setActiveLanguageButton() {
  $(`.pageSettings .section.languages .language`).removeClass("active");
  $(
    `.pageSettings .section.languages .language[language=${config.language}]`
  ).addClass("active");
}

function setActiveCaretStyleButton() {
  $(`.pageSettings .section.caretStyle .buttons .button`).removeClass("active");
  $(
    `.pageSettings .section.caretStyle .buttons .button[caret=` +
      config.caretStyle +
      `]`
  ).addClass("active");
}

function setActiveTimerStyleButton() {
  $(`.pageSettings .section.timerStyle .buttons .button`).removeClass("active");
  $(
    `.pageSettings .section.timerStyle .buttons .button[timer=` +
      config.timerStyle +
      `]`
  ).addClass("active");
}

function setActiveTimerColorButton() {
  $(`.pageSettings .section.timerColor .buttons .button`).removeClass("active");
  $(
    `.pageSettings .section.timerColor .buttons .button[color=` +
      config.timerColor +
      `]`
  ).addClass("active");
}

function setActiveTimerOpacityButton() {
  $(`.pageSettings .section.timerOpacity .buttons .button`).removeClass(
    "active"
  );
  $(
    `.pageSettings .section.timerOpacity .buttons .button[opacity="` +
      config.timerOpacity +
      `"]`
  ).addClass("active");
}

function setSettingsButton(buttonSection, tf) {
  if (tf) {
    $(
      ".pageSettings .section." + buttonSection + " .buttons .button.on"
    ).addClass("active");
    $(
      ".pageSettings .section." + buttonSection + " .buttons .button.off"
    ).removeClass("active");
  } else {
    $(
      ".pageSettings .section." + buttonSection + " .buttons .button.off"
    ).addClass("active");
    $(
      ".pageSettings .section." + buttonSection + " .buttons .button.on"
    ).removeClass("active");
  }
}

function showActiveTags() {
  // activeTags = [];
  // tagsString = "";
  // $.each($('.pageSettings .section.tags .tagsList .tag'), (index, tag) => {
  //     if($(tag).children('.active').attr('active') === 'true'){
  //         activeTags.push($(tag).attr('id'));
  //         tagsString += $(tag).children('.title').text() + ', ';
  //     }
  // })
  // updateTestModesNotice();

  // if($(target).attr('active') === 'true'){
  //     $(target).attr('active','false');
  //     $(target).html('<i class="fas fa-square"></i>')
  // }else{
  //     $(target).attr('active','true');
  //     $(target).html('<i class="fas fa-check-square"></i>')
  // }

  // $.each($('.pageSettings .section.tags .tagsList .tag'), (index, tag) => {
  //     let tagid = $(tag).attr('')
  // })

  dbSnapshot.tags.forEach((tag) => {
    if (tag.active === true) {
      $(
        `.pageSettings .section.tags .tagsList .tag[id='${tag.id}'] .active`
      ).html('<i class="fas fa-check-square"></i>');
    } else {
      $(
        `.pageSettings .section.tags .tagsList .tag[id='${tag.id}'] .active`
      ).html('<i class="fas fa-square"></i>');
    }
  });
}

function toggleTag(tagid, nosave = false) {
  dbSnapshot.tags.forEach((tag) => {
    if (tag.id === tagid) {
      if (tag.active === undefined) {
        tag.active = true;
      } else {
        tag.active = !tag.active;
      }
    }
  });
  updateTestModesNotice();
  if (!nosave) saveActiveTagsToCookie();
}

function updateDiscordSettingsSection() {
  //no code and no discord
  if (firebase.auth().currentUser == null) {
    $(".pageSettings .section.discordIntegration").addClass("hidden");
  } else {
    if (dbSnapshot == null) return;
    $(".pageSettings .section.discordIntegration").removeClass("hidden");

    if (
      dbSnapshot.pairingCode === undefined &&
      dbSnapshot.discordId === undefined
    ) {
      //show button
      $(".pageSettings .section.discordIntegration .howto").addClass("hidden");
      $(".pageSettings .section.discordIntegration .buttons").removeClass(
        "hidden"
      );
      $(".pageSettings .section.discordIntegration .info").addClass("hidden");
      $(".pageSettings .section.discordIntegration .code").addClass("hidden");
    } else if (
      dbSnapshot.pairingCode !== undefined &&
      dbSnapshot.discordId === undefined
    ) {
      //show code
      $(".pageSettings .section.discordIntegration .code .bottom").text(
        dbSnapshot.pairingCode
      );
      $(".pageSettings .section.discordIntegration .howtocode").text(
        dbSnapshot.pairingCode
      );
      $(".pageSettings .section.discordIntegration .howto").removeClass(
        "hidden"
      );
      $(".pageSettings .section.discordIntegration .buttons").addClass(
        "hidden"
      );
      $(".pageSettings .section.discordIntegration .info").addClass("hidden");
      $(".pageSettings .section.discordIntegration .code").removeClass(
        "hidden"
      );
    } else if (
      dbSnapshot.pairingCode !== undefined &&
      dbSnapshot.discordId !== undefined
    ) {
      $(".pageSettings .section.discordIntegration .howto").addClass("hidden");
      $(".pageSettings .section.discordIntegration .buttons").addClass(
        "hidden"
      );
      $(".pageSettings .section.discordIntegration .info").removeClass(
        "hidden"
      );
      $(".pageSettings .section.discordIntegration .code").addClass("hidden");
    }
  }
}

function setActiveConfidenceModeButton() {
  let cm = config.confidenceMode;
  $(".pageSettings .section.confidenceMode .buttons .button").removeClass(
    "active"
  );
  $(
    `.pageSettings .section.confidenceMode .buttons .button[confidenceMode='${cm}']`
  ).addClass("active");
  if (cm !== "off") {
    config.freedomMode = false;
    setSettingsButton("freedomMode", config.freedomMode);
  }
}

//smooth caret
$(".pageSettings .section.smoothCaret .buttons .button.on").click((e) => {
  setSmoothCaret(true);
  // showNotification('Smooth caret on', 1000);
  setSettingsButton("smoothCaret", config.smoothCaret);
});
$(".pageSettings .section.smoothCaret .buttons .button.off").click((e) => {
  setSmoothCaret(false);
  // showNotification('Smooth caret off', 1000);
  setSettingsButton("smoothCaret", config.smoothCaret);
});

//quick tab
$(".pageSettings .section.quickTab .buttons .button.on").click((e) => {
  setQuickTabMode(true);
  // showNotification('Quick tab on', 1000);
  setSettingsButton("quickTab", config.quickTab);
});
$(".pageSettings .section.quickTab .buttons .button.off").click((e) => {
  setQuickTabMode(false);
  // showNotification('Quick tab off', 1000);
  setSettingsButton("quickTab", config.quickTab);
});

//live wpm
$(".pageSettings .section.liveWpm .buttons .button.on").click((e) => {
  config.showLiveWpm = true;
  saveConfigToCookie();
  // showNotification('Live WPM on', 1000);
  setSettingsButton("liveWpm", config.showLiveWpm);
});
$(".pageSettings .section.liveWpm .buttons .button.off").click((e) => {
  config.showLiveWpm = false;
  saveConfigToCookie();
  // showNotification('Live WPM off', 1000);
  setSettingsButton("liveWpm", config.showLiveWpm);
});

//timer bar
$(".pageSettings .section.timerBar .buttons .button.on").click((e) => {
  config.showTimerBar = true;
  saveConfigToCookie();
  // showNotification('Timer bar on', 1000);
  setSettingsButton("timerBar", config.showTimerBar);
});
$(".pageSettings .section.timerBar .buttons .button.off").click((e) => {
  config.showTimerBar = false;
  saveConfigToCookie();
  // showNotification('Timer bar off', 1000);
  setSettingsButton("timerBar", config.showTimerBar);
});

//keymap
$(document).on("click", ".pageSettings .section.keymapMode .button", (e) => {
  let mode = $(e.currentTarget).attr("keymapMode");
  changeKeymapMode(mode);
  restartTest();
  setActiveKeymapModeButton();
  setSettingsButton("liveWpm", config.showLiveWpm);
});

//keymap layouts
$(document).on("click", ".pageSettings .section.keymapLayout .layout", (e) => {
  let layout = $(e.currentTarget).attr("layout");
  changeKeymapLayout(layout);
  // showNotification('Keymap Layout changed', 1000);
  restartTest();
  setActiveKeymapLayoutButton();
});

//freedom mode
$(".pageSettings .section.freedomMode .buttons .button.on").click((e) => {
  setFreedomMode(true);
  saveConfigToCookie();
  // showNotification('Freedom mode on', 1000);
  setSettingsButton("freedomMode", config.freedomMode);
  config.confidenceMode = "off";
  setActiveConfidenceModeButton();
});
$(".pageSettings .section.freedomMode .buttons .button.off").click((e) => {
  setFreedomMode(false);
  saveConfigToCookie();
  // showNotification('Freedom mode off', 1000);
  setSettingsButton("freedomMode", config.freedomMode);
});

// //max confidence
// $(".pageSettings .section.maxConfidence .buttons .button.on").click((e) => {
//   setMaxConfidence(true);
//   saveConfigToCookie();
//   // showNotification('Max confidence on', 1000);
//   setSettingsButton("freedomMode", config.freedomMode);
//   setSettingsButton("maxConfidence", config.maxConfidence);
// });
// $(".pageSettings .section.maxConfidence .buttons .button.off").click((e) => {
//   setMaxConfidence(false);
//   saveConfigToCookie();
//   // showNotification('Max confidence off', 1000);
//   setSettingsButton("freedomMode", config.freedomMode);
//   setSettingsButton("maxConfidence", config.maxConfidence);
// });

//confidence
$(document).on(
  "click",
  ".pageSettings .section.confidenceMode .button",
  (e) => {
    let confidence = $(e.currentTarget).attr("confidenceMode");
    setConfidenceMode(confidence);
    setActiveConfidenceModeButton();
  }
);

//keytips
$(".pageSettings .section.keyTips .buttons .button.on").click((e) => {
  setKeyTips(true);
  // showNotification('Key tips on', 1000);
  setSettingsButton("keyTips", config.showKeyTips);
  if (config.showKeyTips) {
    $(".pageSettings .tip").removeClass("hidden");
  } else {
    $(".pageSettings .tip").addClass("hidden");
  }
});
$(".pageSettings .section.keyTips .buttons .button.off").click((e) => {
  setKeyTips(false);
  // showNotification('Key tips off', 1000);
  setSettingsButton("keyTips", config.showKeyTips);
  if (config.showKeyTips) {
    $(".pageSettings .tip").removeClass("hidden");
  } else {
    $(".pageSettings .tip").addClass("hidden");
  }
});

//keytips
$(".pageSettings .section.discordDot .buttons .button.on").click((e) => {
  setDiscordDot(true);
  setSettingsButton("discordDot", config.showDiscordDot);
});
$(".pageSettings .section.discordDot .buttons .button.off").click((e) => {
  setDiscordDot(false);
  setSettingsButton("discordDot", config.showDiscordDot);
});

//themes
// $(document).on("mouseover",".pageSettings .section.themes .theme", (e) => {
//     let theme = $(e.currentTarget).attr('theme');
//     previewTheme(theme);
// })

$(document).on("click", ".pageSettings .section.themes .theme", (e) => {
  let theme = $(e.currentTarget).attr("theme");
  setTheme(theme);
  setActiveThemeButton();
});

// $(document).on("mouseleave",".pageSettings .section.themes", (e) => {
//     setTheme(config.theme);
// })

//languages
$(document).on("click", ".pageSettings .section.languages .language", (e) => {
  let language = $(e.currentTarget).attr("language");
  changeLanguage(language);
  // showNotification('Language changed', 1000);
  restartTest();
  setActiveLanguageButton();
});

//layouts
$(document).on("click", ".pageSettings .section.layouts .layout", (e) => {
  console.log("clicked");
  let layout = $(e.currentTarget).attr("layout");
  changeLayout(layout);
  // showNotification('Layout changed', 1000);
  restartTest();
  setActiveLayoutButton();
});

//fontsize
$(document).on("click", ".pageSettings .section.fontSize .button", (e) => {
  let fontSize = $(e.currentTarget).attr("fontsize");
  changeFontSize(fontSize);
  // showNotification('Font size changed', 1000);
  setActiveFontSizeButton();
});

//difficulty
$(document).on("click", ".pageSettings .section.difficulty .button", (e) => {
  let difficulty = $(e.currentTarget).attr("difficulty");
  setDifficulty(difficulty);
  // showNotification('Difficulty changed', 1000);
  setActiveDifficultyButton();
});

//caret style
$(document).on("click", ".pageSettings .section.caretStyle .button", (e) => {
  let caretStyle = $(e.currentTarget).attr("caret");
  setCaretStyle(caretStyle);
  // showNotification('Caret style updated', 1000);
  setActiveCaretStyleButton();
});

//timer style
$(document).on("click", ".pageSettings .section.timerStyle .button", (e) => {
  let timerStyle = $(e.currentTarget).attr("timer");
  setTimerStyle(timerStyle);
  // showNotification('Timer style updated', 1000);
  setActiveTimerStyleButton();
});

//timer color
$(document).on("click", ".pageSettings .section.timerColor .button", (e) => {
  let color = $(e.currentTarget).attr("color");
  setTimerColor(color);
  // showNotification('Timer style updated', 1000);
  setActiveTimerColorButton();
});

//timer opacity
$(document).on("click", ".pageSettings .section.timerOpacity .button", (e) => {
  let opacity = $(e.currentTarget).attr("opacity");
  setTimerOpacity(opacity);
  // showNotification('Timer style updated', 1000);
  setActiveTimerOpacityButton();
});

//blind mode
$(".pageSettings .section.blindMode .buttons .button.on").click((e) => {
  setBlindMode(true);
  // showNotification('Blind mode on', 1000);
  setSettingsButton("blindMode", config.blindMode);
});
$(".pageSettings .section.blindMode .buttons .button.off").click((e) => {
  setBlindMode(false);
  // showNotification('Blind mode off', 1000);
  setSettingsButton("blindMode", config.blindMode);
});

//blind mode
$(".pageSettings .section.quickEnd .buttons .button.on").click((e) => {
  setQuickEnd(true);
  // showNotification('Quick end on', 1000);
  setSettingsButton("quickEnd", config.quickEnd);
});
$(".pageSettings .section.quickEnd .buttons .button.off").click((e) => {
  setQuickEnd(false);
  // showNotification('Quick end off', 1000);
  setSettingsButton("quickEnd", config.quickEnd);
});

//flip test
$(".pageSettings .section.flipTestColors .buttons .button.on").click((e) => {
  setFlipTestColors(true);
  // showNotification('Flip test colors on', 1000);
  setSettingsButton("flipTestColors", config.flipTestColors);
});
$(".pageSettings .section.flipTestColors .buttons .button.off").click((e) => {
  setFlipTestColors(false);
  // showNotification('Flip test colors off', 1000);
  setSettingsButton("flipTestColors", config.flipTestColors);
});

//extra color
$(".pageSettings .section.colorfulMode .buttons .button.on").click((e) => {
  setColorfulMode(true);
  // showNotification('Colorful mode on', 1000);
  setSettingsButton("colorfulMode", config.colorfulMode);
});
$(".pageSettings .section.colorfulMode .buttons .button.off").click((e) => {
  setColorfulMode(false);
  // showNotification('Colorful mode off', 1000);
  setSettingsButton("colorfulMode", config.colorfulMode);
});

//extra color
$(".pageSettings .section.randomTheme .buttons .button.on").click((e) => {
  setRandomTheme(true);
  // showNotification('Colorful mode on', 1000);
  setSettingsButton("randomTheme", config.randomTheme);
});
$(".pageSettings .section.randomTheme .buttons .button.off").click((e) => {
  setRandomTheme(false);
  // showNotification('Colorful mode off', 1000);
  setSettingsButton("randomTheme", config.randomTheme);
});

//stop on error
$(".pageSettings .section.stopOnError .buttons .button.on").click((e) => {
  setStopOnError(true);
  setSettingsButton("stopOnError", config.stopOnError);
});
$(".pageSettings .section.stopOnError .buttons .button.off").click((e) => {
  setStopOnError(false);
  setSettingsButton("stopOnError", config.stopOnError);
});

//showAllLines
$(".pageSettings .section.showAllLines .buttons .button.on").click((e) => {
  setShowAllLines(true);
  setSettingsButton("showAllLines", config.showAllLines);
});
$(".pageSettings .section.showAllLines .buttons .button.off").click((e) => {
  setShowAllLines(false);
  setSettingsButton("showAllLines", config.showAllLines);
});

//discord
$(
  ".pageSettings .section.discordIntegration .buttons .generateCodeButton"
).click((e) => {
  showBackgroundLoader();
  generatePairingCode({ uid: firebase.auth().currentUser.uid }).then((ret) => {
    hideBackgroundLoader();
    if (ret.data.status === 1 || ret.data.status === 2) {
      dbSnapshot.pairingCode = ret.data.pairingCode;
      $(".pageSettings .section.discordIntegration .code .bottom").text(
        ret.data.pairingCode
      );
      $(".pageSettings .section.discordIntegration .howtocode").text(
        ret.data.pairingCode
      );
      updateDiscordSettingsSection();
    }
  });
});

//tags
$(document).on(
  "click",
  ".pageSettings .section.tags .tagsList .tag .active",
  (e) => {
    let target = e.currentTarget;
    let tagid = $(target).parent(".tag").attr("id");
    // if($(target).attr('active') === 'true'){
    //     $(target).attr('active','false');
    //     $(target).html('<i class="fas fa-square"></i>')
    // }else{
    //     $(target).attr('active','true');
    //     $(target).html('<i class="fas fa-check-square"></i>')
    // }
    toggleTag(tagid);
    showActiveTags();
  }
);

$(document).on("click", ".pageSettings .section.tags .addTagButton", (e) => {
  showEditTags("add");
});

$(document).on(
  "click",
  ".pageSettings .section.tags .tagsList .tag .editButton",
  (e) => {
    let tagid = $(e.currentTarget).parent(".tag").attr("id");
    let name = $(e.currentTarget).siblings(".title").text();
    showEditTags("edit", tagid, name);
  }
);

$(document).on(
  "click",
  ".pageSettings .section.tags .tagsList .tag .removeButton",
  (e) => {
    let tagid = $(e.currentTarget).parent(".tag").attr("id");
    let name = $(e.currentTarget).siblings(".title").text();
    showEditTags("remove", tagid, name);
  }
);

//theme tabs & custom theme
const colorVars = [
  "--bg-color",
  "--main-color",
  "--caret-color",
  "--sub-color",
  "--text-color",
  "--error-color",
  "--error-extra-color",
  "--colorful-error-color",
  "--colorful-error-extra-color",
];

$(".tab").click((e) => {
  $(".tab").removeClass("active");
  var $target = $(e.currentTarget);
  $target.addClass("active");
  setCustomThemeInputs();
  if ($target.attr("tab") == "preset") {
    setCustomTheme(false);
    applyCustomThemeColors();
    // $('[tabContent="custom"]').removeClass("reveal");
    // $('[tabContent="preset"]').addClass("reveal");
    swapElements(
      $('.pageSettings [tabContent="custom"]'),
      $('.pageSettings [tabContent="preset"]'),
      250
    );
  } else {
    setCustomTheme(true);
    applyCustomThemeColors();
    swapElements(
      $('.pageSettings [tabContent="preset"]'),
      $('.pageSettings [tabContent="custom"]'),
      250
    );

    // $('[tabContent="preset"]').removeClass("reveal");
    // $('[tabContent="custom"]').addClass("reveal");
  }
});

$("[type='color']").on("input", (e) => {
  setCustomTheme(true, true);
  let $colorVar = $(e.currentTarget).attr("id");
  let $pickedColor = $(e.currentTarget).val();

  document.documentElement.style.setProperty($colorVar, $pickedColor);
  $("#" + $colorVar).attr("value", $pickedColor);
  $("[for=" + $colorVar + "]").text($pickedColor);

  // config.customThemeColors[colorVars.indexOf($colorVar)] = $pickedColor
});

$(".colorPicker").on("change", (e) => {
  // Save a color once picked
});

$(".pageSettings .saveCustomThemeButton").click((e) => {
  let save = [];
  $.each(
    $(".pageSettings .section.customTheme [type='color']"),
    (index, element) => {
      save.push($(element).attr("value"));
    }
  );
  setCustomThemeColors(save);
  showNotification("Custom theme colors saved", 1000);
});
