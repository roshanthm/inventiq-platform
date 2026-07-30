import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Database, Moon, Sun, Mail } from 'lucide-react';
import { useThemeStore } from '@/lib/store';
import { PageTransition } from '@/components/shared/PageTransition';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4 text-primary" /> Profile</h3>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-4 text-lg font-bold text-white">
              AK
            </div>
            <div>
              <p className="text-sm font-semibold">Alex Kim</p>
              <p className="text-xs text-muted-foreground">Operations Director</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input defaultValue="Alex Kim" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input defaultValue="alex.kim@stockflow.io" className="mt-1" />
            </div>
            <Button className="w-full" onClick={() => toast.success('Profile updated')}>Save Changes</Button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Palette className="h-4 w-4 text-primary" /> Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-chart-4" /> : <Sun className="h-5 w-5 text-chart-3" />}
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-chart-2" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Push notifications</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-chart-1" />
                <div>
                  <p className="text-sm font-medium">Email Alerts</p>
                  <p className="text-xs text-muted-foreground">Critical alerts via email</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </motion.div>

        {/* System */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Shield className="h-4 w-4 text-primary" /> System</h3>
          <div className="space-y-3">
            {[
              { icon: Database, label: 'Database Status', value: 'Connected', status: 'ok' },
              { icon: SettingsIcon, label: 'AI Engine', value: 'Active', status: 'ok' },
              { icon: Shield, label: 'Security', value: '2FA Enabled', status: 'ok' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
