import { useStats } from "@/hooks/use-attendance";
import { useEmployees } from "@/hooks/use-employees";
import { StatsCard } from "@/components/StatsCard";
import { Users, UserCheck, Briefcase, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: employees, isLoading: employeesLoading } = useEmployees();

  // Calculate some derived stats for the charts
  const departmentData = employees?.reduce((acc: any[], emp) => {
    const existing = acc.find(item => item.name === emp.department);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: emp.department, value: 1 });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your team's performance</p>
        </div>
        <div className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border border-border shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Employees"
            value={stats?.totalEmployees || 0}
            icon={Users}
            variant="accent"
            isLoading={statsLoading}
            trend="+12% from last month"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Present Today"
            value={stats?.presentToday || 0}
            icon={UserCheck}
            isLoading={statsLoading}
            trend="92% attendance rate"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Departments"
            value={departmentData.length}
            icon={Briefcase}
            isLoading={employeesLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Growth"
            value="12%"
            icon={TrendingUp}
            isLoading={false}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold font-display">Department Distribution</h3>
            <p className="text-sm text-muted-foreground">Employee count by department</p>
          </div>
          
          <div className="h-[300px] w-full flex items-center justify-center">
            {employeesLoading ? (
              <div className="text-muted-foreground animate-pulse">Loading chart...</div>
            ) : departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {departmentData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold font-display">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Common tasks</p>
          </div>

          <div className="space-y-3">
             {/* Using Link instead of nested a tag to fix wouter warnings */}
             <a href="/attendance" className="block w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Mark Attendance</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Record daily status</p>
                </div>
              </div>
            </a>
            
            <a href="/employees" className="block w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Add Employee</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Onboard new team member</p>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-auto pt-6">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl p-4 text-white shadow-lg shadow-violet-500/20">
              <p className="text-xs font-medium opacity-80">Pro Tip</p>
              <p className="text-sm font-semibold mt-1">Export monthly reports from the settings menu.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
