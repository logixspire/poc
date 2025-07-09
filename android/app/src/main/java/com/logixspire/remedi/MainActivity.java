package com.logixspire.remedi;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.logixspire.remedi.plugins.NovaIcareLauncherPlugin;
//import com.logixspire.remedi.plugins.NovaIcareLauncherPlugin;
public class MainActivity extends BridgeActivity {
   @Override
   public void onCreate(Bundle savedInstanceState) {
     registerPlugin(NovaIcareLauncherPlugin.class);
     super.onCreate(savedInstanceState);
   }

  //registerPlugin(NovaIcareLauncherPlugin.class);
}
