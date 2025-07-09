package com.logixspire.remedi.plugins;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NovaIcareLauncherPlugin")
public class NovaIcareLauncherPlugin extends Plugin {

  private ActivityResultLauncher<Intent> stethoLauncher;
  private PluginCall savedCall;

  @Override
  public void load() {
    // Register result launcher once when plugin is loaded
    stethoLauncher = bridge.getActivity().registerForActivityResult(
      new ActivityResultContracts.StartActivityForResult(),
      new ActivityResultCallback<ActivityResult>() {
        @Override
        public void onActivityResult(ActivityResult result) {
          handleActivityResult(result);
        }
      }
    );
  }

  @PluginMethod
  public void launchStethoWithResult(PluginCall call) {
    Log.d("NovaIcare", "🚀 launchStethoWithResult() invoked");

    try {
      Intent intent = new Intent();
      intent.putExtra("USE_SENSOR", true);
      intent.putExtra("class_name", call.getString("class_name"));
      intent.putExtra("useflag", "0");
      intent.putExtra("package_name", call.getString("package_name"));
      intent.putExtra("language", call.getString("language"));

      String realId = call.getString("real_id");
      if (realId == null || realId.isEmpty()) {
        intent.putExtra("pid", call.getString("patient_id"));
        Log.d("NovaIcare", "Using patient_id: " + call.getString("patient_id"));
      } else {
        intent.putExtra("pid", realId);
        Log.d("NovaIcare", "Using real_id: " + realId);
      }

      intent.setComponent(new ComponentName(
        "com.neurosynaptic.nova_icare",
        "com.neurosynaptic.usb.StethoSensor"
      ));

      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      savedCall = call;
      stethoLauncher.launch(intent);

    } catch (Exception e) {
      Log.e("NovaIcare", "❌ Failed to launch intent", e);
      call.reject("Failed to launch intent", e);
    }
  }

  private void handleActivityResult(ActivityResult result) {
    Log.d("NovaIcare", "📥 ActivityResult received");

    if (savedCall == null) {
      Log.w("NovaIcare", "⚠️ No saved call");
      return;
    }
    // Log.d("NovaIcare", "ResultCode: " + resultCode + " (Expected: " + Activity.RESULT_OK + ")");
    if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
      String resultValue = result.getData().getStringExtra("result_key"); // Replace with actual key
      Log.d("NovaIcare", "✅ Result: " + resultValue);

      JSObject res = new JSObject();
      res.put("status", "success");
      res.put("result", resultValue != null ? resultValue : "none");
      savedCall.resolve(res);
    } else {
      Log.w("NovaIcare", "❌ No result");
      savedCall.reject("No result");
    }

    savedCall = null; // clear after handling
  }
}
