'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Environment, OrbitControls } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import { SessionModal } from './SessionModal'
import { useSessionStore } from '@/lib/store'
import * as THREE from 'three'

type Task = { id: number; title: string; color: string; icon: string }

function TaskSign({
  task,
  position,
  onClick,
}: {
  task: Task
  position: [number, number, number]
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const bodyRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (bodyRef.current) {
      bodyRef.current.scale.setScalar(
        THREE.MathUtils.lerp(bodyRef.current.scale.x, hovered ? 1.08 : 1.0, 0.1)
      )
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group
        position={position}
        onClick={onClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        {/* Glow border */}
        <mesh>
          <boxGeometry args={[2.4, 0.92, 0.06]} />
          <meshStandardMaterial
            color={task.color}
            transparent
            opacity={hovered ? 0.7 : 0.3}
            emissive={task.color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>

        {/* Sign body */}
        <mesh ref={bodyRef} position={[0, 0, 0.04]}>
          <boxGeometry args={[2.28, 0.80, 0.06]} />
          <meshStandardMaterial color={hovered ? '#1e1e2e' : '#111120'} />
        </mesh>

        {/* Icon */}
        <Text position={[-0.78, 0, 0.1]} fontSize={0.28} anchorX="center" anchorY="middle">
          {task.icon}
        </Text>

        {/* Label */}
        <Text
          position={[0.18, 0, 0.1]}
          fontSize={0.17}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
        >
          {task.title}
        </Text>
      </group>
    </Float>
  )
}

export function DashboardScene({ tasks }: { tasks: Task[] }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCustom, setShowCustom] = useState(false)
  const { activeSession } = useSessionStore()

  const positions = useMemo<[number, number, number][]>(
    () => tasks.map((_, i) => [
      (i % 3 - 1) * 3.6,
      Math.floor(i / 3) * -2.0 + 2.5,
      0,
    ]),
    [tasks.length]
  )

  return (
    <div style={{ width: '100vw', height: '100vh', paddingTop: '64px', background: '#09090b', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 11], fov: 55 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -5, -5]} intensity={0.4} color="#6366f1" />
        <Environment preset="city" />

        {tasks.map((task, i) => (
          <TaskSign
            key={task.id}
            task={task}
            position={positions[i]}
            onClick={() => { if (!activeSession) setSelectedTask(task) }}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {tasks.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <p style={{ color: '#71717a', fontSize: '14px' }}>No tasks yet — add some in the Tasks page.</p>
        </div>
      )}

      {!activeSession && (
        <button
          onClick={() => setShowCustom(true)}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full text-sm font-medium border border-zinc-700 backdrop-blur-sm transition"
        >
          + Something else
        </button>
      )}

      {selectedTask && (
        <SessionModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {showCustom && (
        <SessionModal onClose={() => setShowCustom(false)} />
      )}
    </div>
  )
}
