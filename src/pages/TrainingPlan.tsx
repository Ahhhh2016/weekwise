import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Pencil, Printer } from "lucide-react";

interface TrainingDay {
  content: string;
  duration: string;
  notes: string;
}

// Helper function to get dynamic font size based on content length
const getDynamicFontSize = (text: string, type: 'content' | 'notes') => {
  const length = text.length;
  if (type === 'content') {
    if (length < 100) return 'text-[11px]';
    if (length < 150) return 'text-[10px]';
    if (length < 200) return 'text-[9px]';
    return 'text-[8px]';
  } else {
    // notes
    if (length < 50) return 'text-[11px]';
    if (length < 80) return 'text-[10px]';
    return 'text-[9px]';
  }
};

export default function TrainingPlan() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [trainingData, setTrainingData] = useState<Record<string, TrainingDay>>({
    monday: {
      content: `上半身力量训练（胸、背、肩）
- 热身：动态拉伸5分钟
- 杠铃卧推 4组×8-10次
- 哑铃划船 4组×10次
- 哑铃肩推 3组×12次
- 俯卧撑 3组×15次
- 结束拉伸5分钟`,
      duration: "60分钟",
      notes: "重点关注动作规范，重量可根据个人能力调整。"
    },
    tuesday: {
      content: `有氧训练（间歇跑）
- 热身慢跑5分钟
- 高强度间歇跑（1分钟快跑+2分钟慢走/慢跑，循环5次）
- 冷身走路5分钟
- 拉伸5分钟`,
      duration: "45分钟",
      notes: "提升心肺耐力，注意呼吸节奏。"
    },
    wednesday: {
      content: `下半身力量训练（腿、臀）
- 热身：动态拉伸5分钟
- 深蹲 4组×10次
- 硬拉 4组×8次
- 弓步蹲 3组×12次（每腿）
- 臀桥 3组×15次
- 结束拉伸5分钟`,
      duration: "60分钟",
      notes: "注意膝盖、腰部保护，动作标准。"
    },
    thursday: {
      content: `核心训练+低强度有氧
- 热身：动态拉伸5分钟
- 仰卧卷腹 3组×20次
- 平板支撑 3组×45秒
- 俄罗斯转体 3组×15次
- 有氧：快走或慢跑30分钟
- 拉伸5分钟`,
      duration: "60分钟",
      notes: "核心训练结合低强度有氧，增强稳定性。"
    },
    friday: {
      content: `全身综合力量训练
- 热身：动态拉伸5分钟
- 复合动作循环3组：
   - 俯身划船 12次
   - 硬拉 10次
   - 俯卧撑 15次
   - 深蹲 12次
- 结束拉伸5分钟`,
      duration: "60分钟",
      notes: "循环训练提升心率和整体力量，间歇30-60秒。"
    },
    saturday: {
      content: `有氧训练（户外骑行或游泳）
- 热身5分钟
- 骑行或游泳40分钟（保持中等强度）
- 拉伸5分钟`,
      duration: "50分钟",
      notes: "选择喜欢的有氧方式，保持轻松愉快。"
    },
    sunday: {
      content: `恢复与放松
- 轻柔拉伸15分钟
- 泡沫轴放松10分钟
- 冥想或呼吸训练10分钟`,
      duration: "35分钟",
      notes: "专注身体恢复，有助于下周训练。"
    }
  });

  const [editingCell, setEditingCell] = useState<{day: string, field: keyof TrainingDay} | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("健身爱好者平衡型周训练计划");
  const [tempTitle, setTempTitle] = useState("");

  const toggleComplete = (day: string) => {
    setCompleted(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const startEditing = (day: string, field: keyof TrainingDay) => {
    setEditingCell({ day, field });
    setTempValue(trainingData[day][field]);
  };

  const saveEdit = () => {
    if (editingCell) {
      setTrainingData(prev => ({
        ...prev,
        [editingCell.day]: {
          ...prev[editingCell.day],
          [editingCell.field]: tempValue
        }
      }));
      setEditingCell(null);
      setTempValue("");
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setTempValue("");
  };

  useEffect(() => {
    // 添加打印快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex justify-center items-center py-5" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
      <div className="poster-container w-[210mm] h-[297mm] max-w-full bg-card/95 backdrop-blur-sm p-5 rounded-3xl shadow-2xl relative border border-primary/10 flex flex-col overflow-hidden">
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none rounded-3xl"></div>
        
        {/* Print button */}
        <button
          onClick={() => window.print()}
          className="absolute top-5 right-5 z-20 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 group print:hidden"
          aria-label="打印"
        >
          <Printer className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="header text-center mb-4 relative z-10 flex-shrink-0">
          <div className="inline-flex items-center gap-2 mb-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
            📅 {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
          {editingTitle ? (
            <div className="mb-2" onClick={(e) => e.stopPropagation()}>
              <Input 
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-2xl font-bold text-center"
                autoFocus
                onBlur={() => {
                  setTitle(tempTitle);
                  setEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setTitle(tempTitle);
                    setEditingTitle(false);
                  }
                  if (e.key === 'Escape') {
                    setEditingTitle(false);
                  }
                }}
              />
            </div>
          ) : (
            <h1 
              className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary mb-2 font-bold tracking-tight cursor-pointer relative group/title"
              onClick={() => {
                setTempTitle(title);
                setEditingTitle(true);
              }}
            >
              {title}
              <Pencil className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover/title:opacity-50 transition-opacity text-primary" />
            </h1>
          )}
        </div>

        <table className="schedule-table w-full mb-2 relative z-10 bg-card rounded-2xl overflow-hidden border border-primary/20 shadow-lg table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-primary via-accent to-secondary">
              <th className="text-primary-foreground p-1.5 text-center font-semibold text-xs sticky top-0 w-[10%]">星期</th>
              <th className="text-primary-foreground p-1.5 text-center font-semibold text-xs sticky top-0 w-[32%]">训练内容</th>
              <th className="text-primary-foreground p-1.5 text-center font-semibold text-xs sticky top-0 w-[11%]">时长</th>
              <th className="text-primary-foreground p-1.5 text-center font-semibold text-xs sticky top-0 w-[39%]">重点/备注</th>
              <th className="text-primary-foreground p-1.5 text-center font-semibold text-xs sticky top-0 w-[8%]">完成</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周一</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.monday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('monday', 'content')}>
                {editingCell?.day === 'monday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.monday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('monday', 'duration')}>
                {editingCell?.day === 'monday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.monday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.monday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('monday', 'notes')}>
                {editingCell?.day === 'monday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.monday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.monday}
                  onCheckedChange={() => toggleComplete('monday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周二</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.tuesday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('tuesday', 'content')}>
                {editingCell?.day === 'tuesday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.tuesday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('tuesday', 'duration')}>
                {editingCell?.day === 'tuesday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.tuesday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.tuesday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('tuesday', 'notes')}>
                {editingCell?.day === 'tuesday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.tuesday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.tuesday}
                  onCheckedChange={() => toggleComplete('tuesday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周三</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.wednesday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('wednesday', 'content')}>
                {editingCell?.day === 'wednesday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.wednesday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('wednesday', 'duration')}>
                {editingCell?.day === 'wednesday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.wednesday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.wednesday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('wednesday', 'notes')}>
                {editingCell?.day === 'wednesday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.wednesday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.wednesday}
                  onCheckedChange={() => toggleComplete('wednesday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周四</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.thursday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('thursday', 'content')}>
                {editingCell?.day === 'thursday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.thursday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('thursday', 'duration')}>
                {editingCell?.day === 'thursday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.thursday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.thursday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('thursday', 'notes')}>
                {editingCell?.day === 'thursday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.thursday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.thursday}
                  onCheckedChange={() => toggleComplete('thursday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周五</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.friday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('friday', 'content')}>
                {editingCell?.day === 'friday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.friday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('friday', 'duration')}>
                {editingCell?.day === 'friday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.friday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.friday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('friday', 'notes')}>
                {editingCell?.day === 'friday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.friday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.friday}
                  onCheckedChange={() => toggleComplete('friday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周六</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.saturday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('saturday', 'content')}>
                {editingCell?.day === 'saturday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.saturday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('saturday', 'duration')}>
                {editingCell?.day === 'saturday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.saturday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.saturday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('saturday', 'notes')}>
                {editingCell?.day === 'saturday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.saturday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.saturday}
                  onCheckedChange={() => toggleComplete('saturday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
            <tr className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group">
              <td className="day-cell bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-center text-xs p-1.5 group-hover:scale-105 transition-transform h-[88px] align-middle">周日</td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.sunday.content, 'content')} leading-tight text-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('sunday', 'content')}>
                {editingCell?.day === 'sunday' && editingCell?.field === 'content' ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[80px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full whitespace-pre-line pr-6">
                    {trainingData.sunday.content}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="time-cell bg-gradient-to-br from-muted to-muted/50 text-center font-bold text-primary text-xs align-middle p-1.5 rounded-lg relative group/edit cursor-pointer h-[88px]"
                  onClick={() => startEditing('sunday', 'duration')}>
                {editingCell?.day === 'sunday' && editingCell?.field === 'duration' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs text-center"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {trainingData.sunday.duration}
                    <Pencil className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </>
                )}
              </td>
              <td className={`content-cell p-1.5 ${getDynamicFontSize(trainingData.sunday.notes, 'notes')} leading-tight text-muted-foreground relative group/edit cursor-pointer h-[88px]`}
                  style={{ maxHeight: '88px', display: 'block', boxSizing: 'border-box' }}
                  onClick={() => startEditing('sunday', 'notes')}>
                {editingCell?.day === 'sunday' && editingCell?.field === 'notes' ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="min-h-[40px] text-[11px]"
                      autoFocus
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full pr-6">
                    {trainingData.sunday.notes}
                    <Pencil className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity" />
                  </div>
                )}
              </td>
              <td className="text-center align-middle p-1.5 h-[88px]">
                <Checkbox 
                  checked={completed.sunday}
                  onCheckedChange={() => toggleComplete('sunday')}
                  className="w-4 h-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="tips-section bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-2 mt-2.5 mb-2 relative z-10 border border-primary/20 flex-shrink-0 backdrop-blur-sm">
          <h3 className="tips-title text-xs text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-1.5 font-bold flex items-center">
            💡 每日训练提示
          </h3>
          <ul className="tips-list list-none pl-0 text-[10px] leading-snug space-y-0.5">
            <li className="pl-4 relative text-foreground before:content-['•'] before:absolute before:left-0 before:text-secondary before:font-bold">
              每组之间休息30-90秒，根据训练强度适当调整。
            </li>
            <li className="pl-4 relative text-foreground before:content-['•'] before:absolute before:left-0 before:text-secondary before:font-bold">
              注意补充水分，训练前后适量摄入蛋白质。
            </li>
            <li className="pl-4 relative text-foreground before:content-['•'] before:absolute before:left-0 before:text-secondary before:font-bold">
              若感到疲劳或不适，可适当调整训练量或休息。
            </li>
            <li className="pl-4 relative text-foreground before:content-['•'] before:absolute before:left-0 before:text-secondary before:font-bold">
              训练动作要规范，避免因追求重量而牺牲动作质量。
            </li>
          </ul>
        </div>

        <div className="strategy-section bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-2 mt-2.5 relative z-10 border border-primary/20 flex-shrink-0 backdrop-blur-sm">
          <h3 className="strategy-title text-xs text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary mb-1.5 font-bold flex items-center">
            🎯 关键策略
          </h3>
          <div className="strategy-grid grid grid-cols-4 gap-1.5">
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                渐进式负荷
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                每周可适当增加训练重量或组数
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                多样化训练
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                力量与有氧结合，避免训练疲劳
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                充分恢复
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                保证充足睡眠，有助肌肉修复
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                动作规范
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                安全和动作质量为主要优先级
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                有氧力量结合
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                两者结合效果最佳
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                早晨训练
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                坚持4周即可形成习惯
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                心理建设
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                完成后打勾增强成就感
              </p>
            </div>
            <div className="strategy-item bg-card/80 backdrop-blur-sm p-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h4 className="text-primary mb-0.5 text-[10px] font-bold">
                强度管理
              </h4>
              <p className="text-[9px] text-muted-foreground leading-snug">
                专注于完成动作和呼吸
              </p>
            </div>
          </div>
        </div>

        <div className="footer text-center mt-2 text-xs text-primary relative z-10 font-medium drop-shadow-sm flex-shrink-0">
        </div>

        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 0;
            }
            
            html, body {
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
              height: 297mm !important;
              width: 210mm !important;
            }
            
            body > div {
              padding: 0 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
            
            .poster-container {
              width: 210mm !important;
              height: 297mm !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 10mm !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
              backdrop-filter: none !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            .schedule-table {
              flex: 1 !important;
              display: table !important;
            }

            .hover\\:bg-muted\\/30:hover {
              background: transparent !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
