FROM node:lts-stretch

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends --fix-missing build-essential gcc g++ ca-certificates libmp3lame-dev libxml2-dev libshout-dev libvorbis-dev tcl expect python-dev \
 && rm -rf /var/lib/apt/lists/*

RUN npm install -g 'typescript@3.2' 'forever'

RUN mkdir /var/log/ices
RUN mkdir /etc/ices2

COPY ./ices-0.4.tar.gz /tmp/ices-0.4.tar.gz
COPY ./src /ices
COPY ./ices.conf /ices
COPY ./docker /docker


WORKDIR /tmp
RUN tar xf ices-0.4.tar.gz
WORKDIR /tmp/ices-0.4
RUN ./configure --prefix=/usr/local --with-pic --with-lame --with-python
RUN make
RUN make install clean
RUN mkdir /etc/ices

RUN wget https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py
RUN pip install redis 
COPY ./src/ices.py /usr/local/etc/modules/ices.py

CMD ["bash", "/docker/start.sh"]
