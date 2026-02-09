import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, CalendarCheck, ShieldCheck } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border hidden md:flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl leading-none tracking-tight">HRMS Lite</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage Your Team</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 translate-x-1" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-muted/50 to-muted/10 p-4 rounded-xl border border-border/50">
          <p className="text-xs font-medium text-muted-foreground">Admin User</p>
          <p className="text-xs text-muted-foreground/60 mt-1">admin@hrmslite.com</p>
        </div>
      </div>
    </aside>
  );
}
