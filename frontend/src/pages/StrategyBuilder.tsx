import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '../context/ThemeContext';

type BlockType = 'indicator' | 'condition' | 'action';

interface StrategyBlock {
  id: string;
  type: BlockType;
  name: string;
  params: Record<string, any>;
}

const StrategyBuilder: React.FC = () => {
  const { mode } = useTheme();
  const [blocks, setBlocks] = useState<StrategyBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<StrategyBlock | null>(null);
  const [openConfig, setOpenConfig] = useState(false);

  const availableBlocks: StrategyBlock[] = [
    { id: 'sma', type: 'indicator', name: 'Simple Moving Average', params: { period: 20 } },
    { id: 'ema', type: 'indicator', name: 'Exponential Moving Average', params: { period: 20 } },
    { id: 'rsi', type: 'indicator', name: 'Relative Strength Index', params: { period: 14 } },
    { id: 'price_above', type: 'condition', name: 'Price Above', params: { value: 0 } },
    { id: 'price_below', type: 'condition', name: 'Price Below', params: { value: 0 } },
    { id: 'cross_above', type: 'condition', name: 'Cross Above', params: { indicator1: '', indicator2: '' } },
    { id: 'cross_below', type: 'condition', name: 'Cross Below', params: { indicator1: '', indicator2: '' } },
    { id: 'buy', type: 'action', name: 'Buy', params: { quantity: 1 } },
    { id: 'sell', type: 'action', name: 'Sell', params: { quantity: 1 } },
  ];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  const addBlock = (block: StrategyBlock) => {
    setBlocks([...blocks, { ...block, id: `${block.id}-${Date.now()}` }]);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  const openBlockConfig = (block: StrategyBlock) => {
    setSelectedBlock(block);
    setOpenConfig(true);
  };

  const handleConfigClose = () => {
    setOpenConfig(false);
    setSelectedBlock(null);
  };

  const handleConfigSave = () => {
    if (selectedBlock) {
      const updatedBlocks = blocks.map(block => 
        block.id === selectedBlock.id ? selectedBlock : block
      );
      setBlocks(updatedBlocks);
    }
    handleConfigClose();
  };

  const handleParamChange = (param: string, value: any) => {
    if (selectedBlock) {
      setSelectedBlock({
        ...selectedBlock,
        params: {
          ...selectedBlock.params,
          [param]: value
        }
      });
    }
  };

  const saveStrategy = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Strategy',
          blocks,
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save strategy');
      }

      const savedStrategy = await response.json();
      console.log('Strategy saved:', savedStrategy);
    } catch (error) {
      console.error('Error saving strategy:', error);
    }
  };

  const renderConfigDialog = () => {
    if (!selectedBlock) return null;

    return (
      <Dialog open={openConfig} onClose={handleConfigClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configure {selectedBlock.name}</DialogTitle>
        <DialogContent>
          {Object.entries(selectedBlock.params).map(([key, value]) => (
            <TextField
              key={key}
              margin="dense"
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              type={typeof value === 'number' ? 'number' : 'text'}
              fullWidth
              value={value}
              onChange={(e) => handleParamChange(key, e.target.value)}
              select={key.includes('indicator')}
            >
              {key.includes('indicator') && blocks
                .filter(b => b.type === 'indicator')
                .map(b => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.name}
                  </MenuItem>
                ))}
            </TextField>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfigClose}>Cancel</Button>
          <Button onClick={handleConfigSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Available Blocks */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Available Blocks
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {availableBlocks.map((block) => (
                <Card
                  key={block.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: mode === 'light' ? 'rgba(106, 27, 154, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                  onClick={() => addBlock(block)}
                >
                  <CardContent>
                    <Typography variant="body1">{block.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {block.type}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Strategy Canvas */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, minHeight: '500px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Strategy Canvas</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={saveStrategy}
              >
                Save Strategy
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="strategy-blocks">
                {(provided: DroppableProvided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: '400px' }}
                  >
                    {blocks.map((block, index) => (
                      <Draggable key={block.id} draggableId={block.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 1 }}
                          >
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="body1">{block.name}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {block.type}
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => openBlockConfig(block)}
                                  sx={{ mr: 1 }}
                                >
                                  <SettingsIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => removeBlock(index)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Paper>
        </Grid>
      </Grid>
      {renderConfigDialog()}
    </Box>
  );
};

export default StrategyBuilder; 