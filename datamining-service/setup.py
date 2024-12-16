from setuptools import setup, Extension
import pybind11

ext_modules = [
    Extension(
        "decision_tree_cpp",
        ["decision_tree.cpp"],  # El archivo debe estar en la raíz
        include_dirs=[pybind11.get_include()],
        language='c++',
        extra_compile_args=['/std:c++17']  # Para Windows
    ),
]

setup(
    name="decision_tree_cpp",
    ext_modules=ext_modules,
    install_requires=['pybind11>=2.4.3'],
    setup_requires=['pybind11>=2.4.3'],
)